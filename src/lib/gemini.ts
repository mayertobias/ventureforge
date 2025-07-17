import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
export const geminiModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" // Fast and cost-effective model
});

export const geminiProModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro" // More powerful model for complex tasks
});

export { genAI };