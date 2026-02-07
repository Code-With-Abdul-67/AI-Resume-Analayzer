import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeData(text: string) {
    // Try multiple specific model aliases to bypass regional 404s and handle speed
    const configs = [
        { name: "gemini-2.0-flash", version: "v1" },
        { name: "gemini-2.5-flash", version: "v1" },
        { name: "gemini-2.5-pro", version: "v1" }
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
                {
                    model: config.name,
                    generationConfig: {
                        temperature: 0,
                        topP: 0.1,
                        topK: 1,
                    }
                },
                { apiVersion: config.version as any }
            );

            const prompt = `You are an expert ATS (Applicant Tracking System) Specialist. 
Analyze the provided resume text and return a high-quality, professional optimization report in JSON format.

Scoring Rubric (Calculate total atsScore out of 100):
1. Hard Skills/Keywords (40%): Presence of industry-standard technologies and skills.
2. Experience Impact (30%): Use of action verbs and quantifiable metrics (e.g., "Increased revenue by 20%").
3. Formatting & Structure (20%): Clear hierarchy, presence of standard sections (Experience, Education, etc.).
4. Contact Info & Summary (10%): Completeness of professional links and professional summary.

Rules:
1. Output ONLY a valid JSON object. No markdown, no code blocks, no preamble.
2. Follow this schema exactly: ${jsonSchema}
3. The atsScore MUST be a calculated number based on the rubric above.
4. Experience achievements MUST be translated into metrics-driven bullet points if they aren't already.

Resume Text:
${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();

            // More robust JSON extraction
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("No JSON block found in response:", responseText);
                throw new Error("Invalid AI response format");
            }

            const cleanedJson = jsonMatch[0];
            const parsed = JSON.parse(cleanedJson);

            // Ensure basic structure exists to prevent UI crashes
            return {
                atsScore: parsed.atsScore || 50,
                newResume: {
                    personalInfo: parsed.newResume?.personalInfo || {},
                    summary: parsed.newResume?.summary || "",
                    skills: parsed.newResume?.skills || [],
                    experience: parsed.newResume?.experience || [],
                    education: parsed.newResume?.education || [],
                    projects: parsed.newResume?.projects || []
                },
                tips: parsed.tips || ["Focus on quantifiable achievements.", "Ensure your contact info is up to date."]
            };
        } catch (error: any) {
            lastError = error;
            console.error(`${config.name} failed:`, error.message);
            continue;
        }
    }

    throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}