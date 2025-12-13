import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DesignConcept, QueueAnalysis } from "../types";

const apiKey = process.env.API_KEY;

// Use a fallback or throw an error if no API key, but for this exercise we assume it's there or handled.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash' });

// Schema for Design Concept (Legacy function)
const CONCEPT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    conceptName: { type: Type.STRING },
    visualStyle: { type: Type.STRING },
    componentSystem: { type: Type.STRING },
    layoutWireframe: { type: Type.STRING },
    userFlow: { type: Type.STRING },
    creativeEnhancements: { type: Type.STRING },
    cssSnippet: { type: Type.STRING },
  },
  required: ["conceptName", "visualStyle", "componentSystem", "layoutWireframe", "userFlow", "creativeEnhancements", "cssSnippet"],
};

// Schema for Queue Cam Analysis
const QUEUE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, enum: ['Open', 'Busy', 'Closed', 'Maintenance'], description: "The crowd status based on the image." },
    description: { type: Type.STRING, description: "A short, punchy observation about the scene (e.g., 'Crowd spilling out the door')." },
    details: { type: Type.STRING, description: "Estimated wait time or occupancy (e.g., 'Wait: 15 mins', 'Seats available')." },
  },
  required: ["status", "description", "details"],
};

export const generateDesignConcept = async (userIdea: string): Promise<DesignConcept> => {
    // Legacy function support
    return {} as DesignConcept; 
};

export const analyzeQueuePhoto = async (base64Image: string): Promise<QueueAnalysis> => {
  if (!apiKey) {
    throw new Error("API_KEY is missing.");
  }

  const modelId = "gemini-2.5-flash"; // Multimodal support

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: "Analyze this image of a campus facility (like a cafeteria, library, or gym). Determine the crowd level (Open/Busy/Closed) and estimate wait times or capacity. Be concise." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: QUEUE_SCHEMA,
        temperature: 0.5,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated.");
    }

    return JSON.parse(text) as QueueAnalysis;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    return {
        status: 'Busy',
        description: 'AI Analysis Failed (Simulated)',
        details: 'Wait: Unknown'
    };
  }
};