import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model - using Flash 2.0 for improved performance and cost efficiency
export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp", // Latest Flash 2.0 experimental model
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.7,
  }
});

export const geminiProModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro", // More powerful model for complex tasks
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.5,
  }
});

// Fallback to stable Flash if experimental is not available
export const geminiFlashStable = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.7,
  }
});

export { genAI };