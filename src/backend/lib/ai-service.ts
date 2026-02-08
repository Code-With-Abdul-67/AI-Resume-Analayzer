import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeData(text: string) {
    // Try multiple specific model aliases to bypass regional 404s and handle speed
    const configs = [
        { name: "gemini-1.5-flash", version: "v1" },
        { name: "gemini-1.5-flash-8b", version: "v1" },
        { name: "gemini-2.0-flash-exp", version: "v1" }
    ];

    let lastError;

    // We want to return a detailed JSON structure consistent with our UI
    const jsonSchema = `{
    "atsScore": number,
    "newResume": {
      "personalInfo": { "name": "string", "email": "string", "phone": "string", "linkedin": "string", "github": "string", "location": "string" },
      "summary": "string",
      "skills": ["string"],
      "experience": [{ "role": "string", "company": "string", "duration": "string", "location": "string", "achievements": ["string"] }],
      "education": [{ "degree": "string", "school": "string", "year": "string" }],
      "projects": [{ "name": "string", "description": "string", "highlights": ["string"], "link": "string" }],
      "sectionNames": {
        "summary": "string",
        "skills": "string",
        "experience": "string",
        "education": "string",
        "projects": "string"
      }
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

RULES FOR ABSOLUTE DATA INTEGRITY (CRITICAL):
1. PROTECTED CONTACT FIELDS: You MUST NOT change ANY characters in these fields: "email", "phone", "linkedin", "github", "location". Extract them EXACTLY as they appear. DO NOT "improve" or "standardize" them.
2. NO FACTUAL CHANGES: You MUST NOT change any names (Personal, Company, School), dates (Durations, Graduation Years), or specific Degree/Job Titles.
3. REFINEMENT ONLY: Only improve the *writing* of the professional summary and achievement bullet points. Use stronger action verbs.
4. PROJECT STRUCTURE: For each project, ensure you provide:
   - "name": The project name.
   - "description": A concise overview (1-2 sentences).
   - "highlights": A list of 3-5 technical highlights or features.
   - "link": The project URL if present.

Scoring Rubric (Calculate total atsScore out of 100):
1. Hard Skills/Keywords (40%): Presence of industry-standard technologies and skills.
2. Experience Impact (30%): Use of action verbs and quantifiable metrics.
3. Formatting & Structure (20%): Clear hierarchy.
4. Contact Info & Summary (10%): Completeness.

JSON Output Only. No markdown.
Schema: ${jsonSchema}

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
                    projects: parsed.newResume?.projects || [],
                    sectionNames: parsed.newResume?.sectionNames || {
                        summary: "Professional Summary",
                        skills: "Core Competencies",
                        experience: "Experience",
                        education: "Education",
                        projects: "Projects"
                    }
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