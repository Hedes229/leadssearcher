import { GoogleGenAI } from "@google/genai";
import { Lead, Platform } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to sanitize JSON string from Markdown code blocks
const cleanJsonString = (str: string): string => {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

export const generateLeads = async (
  query: string,
  platform: Platform,
  region: string,
  onProgress: (msg: string) => void
): Promise<Lead[]> => {
  try {
    const modelId = "gemini-2.5-flash"; // Using 2.5 Flash for speed and grounding capabilities
    
    let searchContext = "";
    switch (platform) {
      case Platform.LINKEDIN:
        searchContext = "Focus on searching public LinkedIn profiles and company pages.";
        break;
      case Platform.FACEBOOK:
        searchContext = "Focus on searching public Facebook business pages and public contact info.";
        break;
      case Platform.GOOGLE:
        searchContext = "Use general Google search to find company directories and websites.";
        break;
      default:
        searchContext = "Search across LinkedIn, company websites, and business directories.";
    }

    const prompt = `
      Act as an expert Lead Generation Researcher.
      User Intent: "${query}"
      Target Region: "${region}"
      Strategy: ${searchContext}

      Task:
      1. Use Google Search to find real, existing businesses or professionals matching the user intent.
      2. Extract the following details for at least 5-10 leads if possible: Name (of person or business), Role (if person), Company, Email (if publicly available), Phone (if publicly available), Website, and Source URL.
      3. If specific email/phone is not found, look for "Contact Us" page details. Mark as "N/A" if absolutely not found.
      4. Assign a confidence score (High/Medium/Low) based on data completeness.

      Output Format:
      Strictly return a JSON array of objects. Do not include any conversational text before or after the JSON.
      
      JSON Structure:
      [
        {
          "name": "John Doe",
          "role": "CEO",
          "company": "Acme Corp",
          "email": "contact@acme.com",
          "phone": "+1 555-0123",
          "website": "https://acme.com",
          "source": "https://linkedin.com/in/johndoe",
          "confidence": "High"
        }
      ]
    `;

    onProgress("Initializing AI Research Agent...");
    
    // Using generateContent with googleSearch tool
    // Note: responseMimeType: 'application/json' is NOT compatible with googleSearch tool currently,
    // so we must rely on the prompt to enforce JSON format and parse it manually.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Low temperature for factual extraction
      },
    });

    onProgress("Processing search results...");

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response received from AI.");
    }

    // Extract grounding metadata if needed (optional for UI, but good for debugging)
    // const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    try {
      const jsonString = cleanJsonString(textResponse);
      const rawLeads = JSON.parse(jsonString);

      if (!Array.isArray(rawLeads)) {
        throw new Error("AI did not return an array.");
      }

      // Map and validate to ensure shape matches Lead interface
      const leads: Lead[] = rawLeads.map((item: any, index: number) => ({
        id: `lead-${Date.now()}-${index}`,
        name: item.name || "Unknown",
        role: item.role || "N/A",
        company: item.company || "N/A",
        email: item.email || "N/A",
        phone: item.phone || "N/A",
        website: item.website || "#",
        source: item.source || "Google Search",
        confidence: ["High", "Medium", "Low"].includes(item.confidence) ? item.confidence : "Low",
      }));

      return leads;

    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, textResponse);
      throw new Error("Failed to parse lead data from AI response.");
    }

  } catch (error) {
    console.error("Lead Generation Error:", error);
    throw error;
  }
};