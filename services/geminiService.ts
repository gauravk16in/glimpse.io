import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DesignConcept } from "../types";

const apiKey = process.env.API_KEY;

// Use a fallback or throw an error if no API key, but for this exercise we assume it's there or handled.
// Note: In a real app, never hardcode logic that crashes if env is missing without UI feedback.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash' });

const CONCEPT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    conceptName: { type: Type.STRING, description: "A creative and modern name for the app concept." },
    visualStyle: { type: Type.STRING, description: "Detailed description of colors, typography, and layout style." },
    componentSystem: { type: Type.STRING, description: "Description of UI elements like buttons, inputs, cards, etc." },
    layoutWireframe: { type: Type.STRING, description: "Section-by-section breakdown of the landing page or main view." },
    userFlow: { type: Type.STRING, description: "A concise walkthrough of the primary user journey." },
    creativeEnhancements: { type: Type.STRING, description: "Unique micro-interactions, motion effects, or special aesthetic touches." },
    cssSnippet: { type: Type.STRING, description: "A raw CSS or Tailwind class string for a signature element (e.g., a button or card)." },
  },
  required: ["conceptName", "visualStyle", "componentSystem", "layoutWireframe", "userFlow", "creativeEnhancements", "cssSnippet"],
};

export const generateDesignConcept = async (userIdea: string): Promise<DesignConcept> => {
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }

  const modelId = "gemini-2.5-flash"; // Fast and capable for this task
  
  const systemInstruction = `You are a Senior UI/UX Creative Designer specializing in modern, minimal, brutalist, and aesthetic digital products.
Your goal is to take a raw app idea and transform it into a high-end design specification.
Focus on "Pixel-Perfect" descriptions. Use design terminology (e.g., "glassmorphism", "neobrutalism", "Swiss style", "grid-based", "generative").
`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: userIdea,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: CONCEPT_SCHEMA,
        temperature: 0.8, // Slightly creative
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(text) as DesignConcept;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
