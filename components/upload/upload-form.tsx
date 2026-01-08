"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";

// Schema definition
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err);
      toast.error("Error occurred while uploading");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // 1. Validate File
      const validatedFields = schema.safeParse({ file });
      
      if (!validatedFields.success) {
        toast.error(
          validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file."
        );
        return;
      }

      setIsLoading(true);

      toast("📄 Uploading PDF...", {
        description: "We are uploading your PDF!",
      });

      // 2. Upload to UploadThing
      const uploadResponse = await startUpload([file]);
      
      if (!uploadResponse) {
        toast.error("Upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // 👇 Fix: URL direct access karo
      const uploadFileUrl = uploadResponse[0].url;

      toast("⏳ Processing PDF...", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      // 3. Generate Summary (Server Action 1)
      const generateResult = await generatePdfSummary({
        fileUrl: uploadFileUrl,
        fileName: file.name,
      });

      if (!generateResult.success || !generateResult.data) {
        toast.error(generateResult.message || "Failed to generate summary");
        setIsLoading(false);
        return;
      }

      // 4. Save Summary (Server Action 2 - Timeout Reset Strategy)
      toast("💾 Saving PDF...", {
        description: "Almost done! Saving your summary! ✨",
      });

      const storeResult = await storePdfSummaryAction({
        summary: generateResult.data.summary,
        fileUrl: uploadFileUrl,
        title: generateResult.data.title,
        fileName: file.name,
      });

      if (storeResult.success && storeResult.data) {
        toast.success("✨ Summary Generated!", {
          description: "Your summary has been successfully saved",
        });

        formRef.current?.reset();
        router.push(`/summaries/${storeResult.data.id}`);
      } else {
        toast.error(storeResult.message || "Failed to save summary");
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Critical error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm animate-pulse">
                Processing AI Summary...
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      ) : (
        <UploadFormInput
          isLoading={isLoading}
          ref={formRef}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}