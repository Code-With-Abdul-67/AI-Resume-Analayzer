"use server";

import { prisma } from "@/backend/lib/prisma";
import { extractTextFromPDF } from "@/backend/lib/pdf-worker";
import { analyzeResumeData } from "@/backend/lib/ai-service";
import { redirect } from "next/navigation";
import { auth } from "@/backend/auth";

export async function processResume(formData: FormData) {
  let savedId: string | null = null;
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized: Please sign in to upload resumes.");
  }

  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    // File Validation
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Invalid file type. Please upload a PDF.");
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error("File too large. Maximum size is 5MB.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 1. Extract text
    const rawText = await extractTextFromPDF(uint8Array);
    if (!rawText || rawText.length < 50) {
      throw new Error("Could not extract enough text from the resume. Is the PDF empty or scanned?");
    }

    // 2. AI Analysis
    const analysis = await analyzeResumeData(rawText);

    // 3. Database Save
    const saved = await prisma.resume.create({
      data: {
        rawText,
        structured: (analysis.newResume || {}) as any,
        atsScore: analysis.atsScore || 0,
        suggestions: (analysis.tips || []) as string[],
        userId: session.user.id,
      } as any,
    });

    savedId = saved.id;
  } catch (error: any) {
    // If it's a redirect, let it pass
    if (error.message === 'NEXT_REDIRECT') throw error;

    console.error("Action Error:", error.message);
    throw new Error(error.message || "An unexpected error occurred during processing.");
  }

  // 4. Redirect MUST happen outside the try/catch block
  if (savedId) {
    redirect(`/results/${savedId}`);
  }
}