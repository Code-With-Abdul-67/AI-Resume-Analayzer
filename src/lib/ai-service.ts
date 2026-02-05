import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeData(text: string) {
    // Try multiple specific model aliases to bypass regional 404s and handle speed
    const configs = [
        { name: "gemini-1.5-flash-latest", version: "v1beta" },
        { name: "gemini-1.5-flash", version: "v1beta" },
        { name: "gemini-1.5-pro-latest", version: "v1beta" },
        { name: "gemini-pro", version: "v1" }
    ];

    let lastError;

    // We want to return a detailed JSON structure consistent with our UI
    const jsonSchema = `{
    "atsScore": number,
    "newResume": {
      "personalInfo": { "name": "string", "email": "string", "phone": "string", "linkedin": "string", "github": "string", "location": "string" },
      "summary": "string",
      "skills": ["string"],
      "experience": [{ "role": "string", "company": "string", "duration": "string", "achievements": ["string"] }],
      "education": [{ "degree": "string", "school": "string", "year": "string" }],
      "projects": [{ "name": "string", "description": "string" }]
    },
    "tips": ["string"]
  }`;

    for (const config of configs) {
        try {
            console.log(`Attempting analysis with ${config.name}...`);
            const model = genAI.getGenerativeModel(
                { model: config.name },
                { apiVersion: config.version as any }
            );

            const prompt = `You are a professional resume analyzer. Analyze the provided resume text and return a high-quality optimization report in JSON format.
      
Rules:
1. Output ONLY a valid JSON object. No markdown, no code blocks, no preamble.
2. Follow this schema exactly: ${jsonSchema}
3. The atsScore should be 0-100 based on keyword density and impact.
4. Experience achievements should be metrics-driven bullet points.

Resume Text:
${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();

            // Clean potential Markdown wrapping before parsing
            const cleanedJson = responseText.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanedJson);
        } catch (error: any) {
            lastError = error;
            console.error(`${config.name} failed:`, error.message);
            continue;
        }
    }

    throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}