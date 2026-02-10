import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeData(text: string) {
    // UPDATED: Using Gemini 3 Flash (Fastest/Smartest) 
    // or Gemini 2.5 Flash (Workhorse)
    const configs = [
        { name: "gemini-3-flash-preview" }, // Use this for cutting-edge speed
        { name: "gemini-2.5-flash" }        // Use this for stable performance
    ];
    let lastError;

    const jsonSchema = `{
    "atsScore": number,
    "newResume": {
      "personalInfo": { "name": "string", "email": "string", "phone": "string", "linkedin": "string", "github": "string", "location": "string" },
      "summary": "string",
      "skills": ["string"],
      "experience": [{ "role": "string", "company": "string", "duration": "string", "location": "string", "achievements": ["string"] }],
      "education": [{ "degree": "string", "school": "string", "year": "string" }],
      "projects": [{ "name": "string", "description": "string", "highlights": ["string"], "link": "string" }],
      "sectionNames": { "summary": "string", "skills": "string", "experience": "string", "education": "string", "projects": "string" }
    },
    "tips": ["string"]
  }`;

    for (const config of configs) {
        try {
            console.log(`Attempting analysis with ${config.name}...`);

            // REMOVED apiVersion: "v1beta" as these models are on the stable v1 endpoint
            const model = genAI.getGenerativeModel({
                model: config.name,
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.95,
                    responseMimeType: "application/json", // Native JSON output
                }
            });

            const prompt = `You are an expert ATS Specialist. Analyze this resume text and return a high-quality optimization report in JSON format.
            Schema: ${jsonSchema}
            Resume Text: ${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();

            const parsed = JSON.parse(responseText);

            return {
                atsScore: parsed.atsScore || 50,
                newResume: parsed.newResume || {},
                tips: parsed.tips || ["Focus on quantifiable achievements."]
            };
        } catch (error: any) {
            lastError = error;
            console.error(`${config.name} failed:`, error.message);
            continue;
        }
    }

    throw new Error(`AI Analysis failed. Please check your API key. Error: ${lastError?.message}`);
}