import { GoogleGenAI } from "@google/genai";

// As per guidelines, the API key must be available as an environment variable.
if (!process.env.API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this context, throwing an error is sufficient to indicate a misconfiguration.
  console.error("API_KEY environment variable not set. Please configure it in your environment.");
}

// FIX: Initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @param systemInstruction An optional instruction to set the persona and context for the AI.
 * @returns The generated text content as a string.
 */
export const generateContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    // FIX: Use ai.models.generateContent with the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      ...(systemInstruction && { config: { systemInstruction } }),
    });
    
    // FIX: Directly access the .text property for the response as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Sorry, there was an error generating a response. Please check the console for details.";
  }
};