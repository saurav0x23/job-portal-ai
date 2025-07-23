export const runtime = "nodejs";

import { analyzeResume } from "@/lib/openrouter";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

// Extract PDF text using pdf2json
async function extractTextWithPdf2json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData?.Pages?.map((page) =>
        page.Texts.map((t) =>
          decodeURIComponent(t.R.map((r) => r.T).join(""))
        ).join(" ")
      ).join("\n");
      resolve(text || "");
    });
    pdfParser.parseBuffer(buffer);
  });
}

// PDF extractor with fallback
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const methods = [{ name: "pdf2json", fn: extractTextWithPdf2json }];

  let lastError: Error | null = null;

  for (const method of methods) {
    try {
      console.log(`Trying PDF extraction with ${method.name}`);
      const text = await method.fn(buffer);
      if (text?.trim()) return text;
    } catch (err: any) {
      console.warn(`${method.name} failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(
    `All PDF extraction methods failed. Last error: ${
      lastError?.message || "Unknown"
    }`
  );
}

// Handle any supported file type
async function extractTextFromBuffer(
  buffer: Buffer,
  fileType: string,
  fileName?: string
): Promise<string> {
  const isPDF =
    fileType.includes("pdf") || fileName?.toLowerCase().endsWith(".pdf");
  const isDOCX =
    fileType.includes("wordprocessing") ||
    fileName?.toLowerCase().endsWith(".docx");
  const isTXT = fileType.startsWith("text/") || fileName?.endsWith(".txt");

  if (isPDF) return extractTextFromPDF(buffer);
  if (isDOCX) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }
  if (isTXT) return buffer.toString("utf-8");

  throw new Error(`Unsupported file type: ${fileType}`);
}

// Main POST handler
export async function POST(request: Request) {
  console.log("=== Starting resume processing ===");

  try {
    const contentType = request.headers.get("content-type") || "";

    let resumeUrl = "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      resumeUrl = formData.get("resumeUrl")?.toString() || "";
    } else {
      const body = await request.json();
      resumeUrl = body.resumeUrl || "";
    }

    if (!resumeUrl) {
      return NextResponse.json(
        { error: "No resume URL provided" },
        { status: 400 }
      );
    }

    // Download the resume file
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch resume: HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) {
      return NextResponse.json(
        { error: "Downloaded file is empty" },
        { status: 400 }
      );
    }

    // Validate PDF
    const fileType = response.headers.get("content-type") || "";
    if (
      (fileType.includes("pdf") || resumeUrl.toLowerCase().endsWith(".pdf")) &&
      !buffer.slice(0, 4).toString().startsWith("%PDF")
    ) {
      return NextResponse.json({ error: "Invalid PDF file." }, { status: 400 });
    }

    // Extract text from file
    const extractedText = await extractTextFromBuffer(
      buffer,
      fileType,
      resumeUrl
    );
    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "No text found in resume." },
        { status: 400 }
      );
    }

    // Initialize Supabase and fetch jobs
    const supabase = createClient();
    const { data: jobs, error: jobsError } = await (await supabase)
      .from("jobs")
      .select("*");

    if (jobsError) {
      throw new Error(`Failed to fetch jobs: ${jobsError.message}`);
    }

    // Analyze resume with job context
    const aiData = await analyzeResume(extractedText, jobs || []);
    if (
      !aiData ||
      !Array.isArray(aiData.titles) ||
      !Array.isArray(aiData.skills)
    ) {
      return NextResponse.json(
        { error: "AI analysis returned invalid format" },
        { status: 500 }
      );
    }

    // Build query based on AI analysis
    let query = (await supabase).from("jobs").select("*"); // ← no await here

    const titleConditions = aiData.titles
      .filter(Boolean)
      .map((title: string) => `title.ilike.%${title.trim()}%`);

    const skills = aiData.skills.filter(Boolean);

    if (titleConditions.length || skills.length) {
      const filters = [];

      if (titleConditions.length) {
        filters.push(`(${titleConditions.join(" or ")})`);
      }
      if (skills.length) {
        filters.push(`required_skills.ov.{${skills.join(",")}}`);
      }

      query = query.or(filters.join(",")); // This is now valid
    }

    const { data, error } = await query; // await only here

    if (error) {
      console.error("Error fetching jobs:", error.message);
    } else {
      console.log("Fetched jobs:", data);
    }

    // Execute the query
    const { data: matchedJobs, error: queryError } = await query;

    if (queryError) {
      console.error("Job query error:", queryError);
      return NextResponse.json(
        { error: "Failed to query jobs" },
        { status: 500 }
      );
    }

    // Enhance jobs with AI matching data
    const enhancedJobs = (matchedJobs || [])
      .map((job) => {
        const match = aiData.bestMatches?.find((m: any) => m.jobId === job.id);
        return {
          ...job,
          relevance: match?.matchScore || 0,
          matchedSkills: match?.matchingSkills?.length || 0,
        };
      })
      .sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({
      jobs: enhancedJobs,
      aiInsights: aiData,
      summary: {
        totalJobs: enhancedJobs.length,
        topRelevance: enhancedJobs[0]?.relevance || 0,
        extractedTextLength: extractedText.length,
      },
    });
  } catch (err: any) {
    console.error("Resume processing error:", err);
    return NextResponse.json(
      {
        error: err.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
