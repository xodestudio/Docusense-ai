"use server";

import { getDbConnection } from "@/lib/db";

import { generateSummaryFromGemini } from "@/lib/gemini-ai";

import { fetchAndExtractPdfText } from "@/lib/langchain";

import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

// Agar format util nahi hai to ye fallback function

function formatFileNameAsTitle(fileName: string) {
  return fileName.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
}

interface PdfSummaryType {
  userId?: string;

  fileUrl: string;

  summary: string;

  title: string;

  fileName: string;
}

export async function generatePdfSummary({
  fileUrl,

  fileName,
}: {
  fileUrl: string;

  fileName: string;
}) {
  if (!fileUrl) {
    return { success: false, message: "File upload failed", data: null };
  }

  try {
    console.log("📥 Extracting text via LangChain...");

    // 👇 LangChain Magic

    const pdfText = await fetchAndExtractPdfText(fileUrl);

    // 🛡️ FIX: Check added here to satisfy TypeScript & Runtime safety

    if (!pdfText) {
      throw new Error(
        "Failed to extract text. The PDF might be empty or unreadable."
      );
    }

    console.log(`✅ Text Extracted! Length: ${pdfText.length}`);

    // Call Gemini

    const summary = await generateSummaryFromGemini(pdfText);

    if (!summary) {
      return {
        success: false,

        message: "Failed to generate summary",

        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,

      message: "Summary generated successfully",

      data: {
        title: formattedFileName,

        summary,
      },
    };
  } catch (error) {
    console.error("Error in Process:", error);

    return {
      success: false,

      message: error instanceof Error ? error.message : "Processing failed",

      data: null,
    };
  }
}

export async function storePdfSummaryAction({
  fileUrl,

  summary,

  title,

  fileName,
}: PdfSummaryType) {
  let savedSummary: any;

  try {
    const { userId } = await auth();

    if (!userId) return { success: false, message: "User not found" };

    const sql = await getDbConnection();

    // Using simple query structure

    const result = await sql`

      INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name)

      VALUES (${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName})

      RETURNING id

    `;

    savedSummary = result[0];

    if (!savedSummary)
      return { success: false, message: "Failed to save summary" };
  } catch (error) {
    console.error("Database Error:", error); // Log error for debugging

    return { success: false, message: "Database Error" };
  }

  revalidatePath(`/summaries/${savedSummary.id}`);

  return { success: true, message: "Saved", data: { id: savedSummary.id } };
}
