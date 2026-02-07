"use server";

import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf-worker";
import { analyzeResumeData } from "@/lib/ai-service";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function processResume(formData: FormData) {
  let savedId: string | null = null;
  const session = await auth();

  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 1. Extract text
    const rawText = await extractTextFromPDF(uint8Array);

    // 2. AI Analysis (Ensure your ai-service.ts strips markdown backticks!)
    const analysis = await analyzeResumeData(rawText);

    // 3. Database Save
    const saved = await prisma.resume.create({
      data: {
        rawText,
        structured: analysis.newResume || {},
        atsScore: analysis.atsScore || 0,
        suggestions: analysis.tips || [],
        userId: session?.user?.id,
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