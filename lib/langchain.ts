import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

export async function fetchAndExtractPdfText(fileUrl: string) {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1)
        console.log(
          `🔄 Retrying PDF fetch (Attempt ${attempt}/${MAX_RETRIES})...`
        );

      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/pdf",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch PDF: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const loader = new WebPDFLoader(blob);

      // 🤫 START: Suppress Console Warnings (Font Noise Fix)
      const originalWarn = console.warn;
      console.warn = (...args) => {
        // Sirf "Ran out of space" wali warning ko ignore kro
        if (typeof args[0] === "string" && args[0].includes("Ran out of space"))
          return;
        originalWarn.apply(console, args);
      };
      // ----------------------------------------------------

      const docs = await loader.load();

      // 🔊 END: Restore Console Warnings
      console.warn = originalWarn;
      // ----------------------------------------------------

      const fullText = docs.map((doc) => doc.pageContent).join("\n");

      if (!fullText || fullText.trim().length === 0) {
        throw new Error("Extracted text is empty");
      }

      return fullText.trim();
    } catch (error: any) {
      console.error(
        `❌ Error in LangChain PDF Loader (Attempt ${attempt}):`,
        error.message
      );

      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Failed to extract text after ${MAX_RETRIES} attempts. Network or Parsing Error.`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
}
