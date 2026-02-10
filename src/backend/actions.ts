"use server";

import { prisma } from "@/backend/lib/prisma";
import { extractTextFromPDF } from "@/backend/lib/pdf-worker";
import { analyzeResumeData } from "@/backend/lib/ai-service";
import { redirect } from "next/navigation";
import { auth } from "@/backend/auth";
import { revalidatePath } from "next/cache";

const MAX_FREE_RESUMES = 10;

export async function getResumeUsage() {
  const session = await auth();
  if (!session || !session.user?.id) return { count: 0, limit: MAX_FREE_RESUMES };

  const count = await prisma.resume.count({
    where: { userId: session.user.id }
  });

  return { count, limit: MAX_FREE_RESUMES };
}

export async function processResume(formData: FormData) {
  let savedId: string | null = null;
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized: Please sign in to upload resumes.");
  }

  // Quota Check
  const count = await prisma.resume.count({
    where: { userId: session.user.id }
  });

  if (count >= MAX_FREE_RESUMES) {
    throw new Error(`Quota reached: You can only analyze up to ${MAX_FREE_RESUMES} resumes on the free tier.`);
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

export async function clearHistory() {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.resume.deleteMany({
    where: {
      userId: session.user.id
    } as any
  });

  revalidatePath('/history');
}

export async function deleteResume(id: string) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  // Ensure the resume belongs to the user
  const resume = await prisma.resume.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!resume || resume.userId !== session.user.id) {
    throw new Error("Resume not found or unauthorized");
  }

  await prisma.resume.delete({
    where: { id }
  });

  revalidatePath('/history');
}