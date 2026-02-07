import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listModels() {
    try {
        console.log("Fetching available models...");
        // Iterate through common API versions to see what's available
        const versions = ["v1", "v1beta"];

        for (const version of versions) {
            console.log(`\n--- Checking API Version: ${version} ---`);
            const response = await fetch(
                `https://generativelanguage.googleapis.com/${version}/models?key=${process.env.GEMINI_API_KEY}`
            );
            const data = await response.json();

            if (data.models) {
                data.models.forEach((m: any) => {
                    console.log(`${m.name} - Supports: ${m.supportedGenerationMethods.join(", ")}`);
                });
            } else {
                console.log(`No models found or error for ${version}:`, data.error?.message || "Unknown error");
            }
        }
    } catch (error: any) {
        console.error("Diagnostic failed:", error.message);
    }
}

listModels();
