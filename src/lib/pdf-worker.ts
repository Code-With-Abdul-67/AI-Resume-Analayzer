// src/lib/pdf-worker.ts
import { extractText } from "unpdf";

export const extractTextFromPDF = async (data: Uint8Array): Promise<string> => {
  try {
    const { text } = await extractText(data);
    const rawText = Array.isArray(text) ? text.join(' ') : text;
    return rawText;
  } catch (error: any) {
    throw new Error(`Extraction failed: ${error.message}`);
  }
};