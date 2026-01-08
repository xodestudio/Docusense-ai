import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

export const generateSummaryFromGemini = async (pdfText: string) => {
  // 1. API Key Check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
  }

  // 2. Initialize New SDK
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    // 🔴 SAFETY CHECK: Text Truncation (Timeout se bachne ke liye)
    const truncatedText = pdfText.slice(0, 100000);
    const cleanedPdfText = truncatedText.replace(/\s{2,}/g, " ").trim();

    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${cleanedPdfText}`;

    console.log("🤖 Sending request to Gemini (New SDK)...");

    // 3. Generate Content (New Syntax)
    // Note: Maine model 'gemini-1.5-flash' rakha hai kyunke '2.5' abhi public nahi hai.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    // 4. Extract Text
    const summary = response.text;

    if (!summary) {
      throw new Error("Empty response from Gemini API");
    }

    console.log("✅ Gemini Summary Generated!");
    return summary;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    throw error;
  }
};
