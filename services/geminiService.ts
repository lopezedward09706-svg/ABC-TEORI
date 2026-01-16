
import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI using named parameter with the exact process.env.API_KEY string
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAnalysis = async (iaName: string, context: string) => {
  try {
    // Fix: Using gemini-3-flash-preview model for basic text analysis as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are acting as the specialized AI: ${iaName}. 
      Task context: ${context}.
      The context is about the ABC Theory (where nodes a=+1/3, b=-2/9, c=-1/9 form space-time).
      Provide a concise, expert-level technical validation report (max 3 sentences) in Spanish. 
      Use emojis related to your specific role.`,
    });
    // Fix: Accessing the .text property directly from the response object
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error en la conexión con el servidor de IA.";
  }
};
