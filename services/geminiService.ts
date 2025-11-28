import { GoogleGenAI } from "@google/genai";

// Get API key from environment variable (must be NEXT_PUBLIC_ for client-side access)
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Initialize GoogleGenAI only if API key is available
let ai: any = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("Gemini API key not configured. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
}

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @param systemInstruction An optional instruction to set the persona and context for the AI.
 * @returns The generated text content as a string.
 */
export const generateContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    if (!ai) {
      return "Gemini API is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.";
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      ...(systemInstruction && { config: { systemInstruction } }),
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Sorry, there was an error generating a response. Please check the console for details.";
  }
};