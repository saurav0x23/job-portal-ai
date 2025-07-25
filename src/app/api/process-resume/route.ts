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

// Extract text from buffer
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

    // Download resume
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

    // Validate PDF signature
    const fileType = response.headers.get("content-type") || "";
    if (
      (fileType.includes("pdf") || resumeUrl.toLowerCase().endsWith(".pdf")) &&
      !buffer.slice(0, 4).toString().startsWith("%PDF")
    ) {
      return NextResponse.json({ error: "Invalid PDF file." }, { status: 400 });
    }

    // Extract text
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

    // Fetch job IDs
    const supabase = createClient();
    const { data: jobs, error: jobsError } = await (await supabase)
      .from("jobs")
      .select("id, title");

    if (jobsError) {
      throw new Error(`Failed to fetch jobs: ${jobsError.message}`);
    }

    // AI analyze resume
    const aiResponse = await analyzeResume(extractedText, jobs);
    const matchedIds = aiResponse.matchedJobIds.filter(Boolean);

    if (!matchedIds.length) {
      return NextResponse.json(
        { error: "AI returned no matched job IDs" },
        { status: 404 }
      );
    }

    // Fetch matching jobs by ID
    const { data: matchedJobs, error: fetchError } = await (await supabase)
      .from("jobs")
      .select("*")
      .in("id", matchedIds);

    if (fetchError) {
      throw new Error(`Failed to fetch matched jobs: ${fetchError.message}`);
    }

    if (!matchedJobs || matchedJobs.length === 0) {
      return NextResponse.json(
        { error: "No matching jobs found" },
        { status: 404 }
      );
    }

    // Optionally add match score from AI to each job
    const enrichedJobs = matchedJobs.map((job) => {
      const match = aiResponse.matchedJobIds.find(
        (m: any) => m.jobId === job.id
      );
      return {
        ...job,
        relevance: match?.matchScore || 0,
        matchedSkills: match?.matchingSkills || [],
      };
    });

    return NextResponse.json({
      jobs: enrichedJobs,
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
