import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

export const generateSummaryFromGemini = async (pdfText: string) => {
  // 1. API Key Check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
  }

  // 2. Initialize SDK
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    // 🔴 SAFETY CHECK: Truncate to avoid token limits if file is massive
    // Gemini 1.5 Flash ka context window bada hai (1M tokens), to hum zyada text bhej skte hain
    const truncatedText = pdfText.slice(0, 300000);

    // Prompt Construction
    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nHere is the raw document text to process:\n\n${truncatedText}`;

    console.log("🤖 Sending request to Gemini...");

    // 3. Generate Content
    // Model: 'gemini-2.5-flash' is recommended for high speed & large context.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.6, // Thora creative taake content expand kr sake
        maxOutputTokens: 8192, // Output lamba allow kro
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
