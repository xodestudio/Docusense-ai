import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(fileUrl: string) {
  try {
    // 1. URL se PDF fetch karo
    const response = await fetch(fileUrl);

    // 2. Usay Blob mein convert karo (File system avoid karne ke liye)
    const blob = await response.blob();

    // 3. LangChain Loader initialize karo
    const loader = new PDFLoader(blob);

    // 4. Load karo
    const docs = await loader.load();

    // 5. Saare pages ka text join kar ke return karo
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("❌ Error in LangChain PDF Loader:", error);
    throw new Error("Failed to extract text using LangChain");
  }
}
