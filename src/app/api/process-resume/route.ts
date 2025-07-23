import { analyzeResume } from "@/lib/openrouter";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdf from "pdf-parse";

// Extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const data = await pdf(buffer);
    return data.text;
  } else if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name?.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error("Unsupported file format");
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await extractTextFromFile(file);
    const aiData = await analyzeResume(text);

    // Get matching jobs
    const supabase = createClient();
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select()
      .or(
        `title.ilike.any.(${aiData.titles
          .map((t) => `"${t}"`)
          .join(",")}),skills.ov.{${aiData.skills.join(",")}}`
      )
      .limit(20);

    if (error) throw error;

    // Calculate relevance scores
    const scoredJobs = jobs
      .map((job) => {
        let score = 0;
        if (
          aiData.titles.some((title) =>
            job.title.toLowerCase().includes(title.toLowerCase())
          )
        ) {
          score += 30;
        }
        const matchedSkills = job.required_skills.filter((skill) =>
          aiData.skills.includes(skill)
        );
        score += matchedSkills.length * 10;
        return { ...job, relevance: Math.min(100, score) };
      })
      .sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({ jobs: scoredJobs, aiInsights: aiData });
  } catch (error: any) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process resume" },
      { status: 500 }
    );
  }
}
