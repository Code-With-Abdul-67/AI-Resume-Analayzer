"use server";

import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf-worker";
import { analyzeResumeData } from "@/lib/ai-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function processResume(formData: FormData) {
  let savedId: string | null = null;

  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 1. Extract text
    const rawText = await extractTextFromPDF(uint8Array);

    // 2. CHECK FOR DEDUPLICATION: If exactly same text exists, return existing results
    const existingResume = await prisma.resume.findFirst({
      where: { rawText },
      orderBy: { createdAt: 'desc' }
    });

    if (existingResume) {
      savedId = existingResume.id;
      console.log("Deduplication: Found existing resume analysis.");
      return; // Skip AI analysis and create step
    }

    // 3. AI Analysis (Ensure your ai-service.ts strips markdown backticks!)
    const analysis = await analyzeResumeData(rawText);

    // 3. Database Save
    const saved = await prisma.resume.create({
      data: {
        rawText,
        structured: analysis.newResume || {},
        atsScore: analysis.atsScore || 0,
        suggestions: analysis.tips || [],
      },
    });

    savedId = saved.id;
  } catch (error: any) {
    console.error("Action Error:", error.message);
    throw new Error(error.message);
  }

  // 4. Redirect MUST happen outside the try/catch block
  if (savedId) {
    redirect(`/results/${savedId}`);
  }
}