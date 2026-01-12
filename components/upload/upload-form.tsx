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

      toast.info("Uploading PDF...", {
        description: "Please wait while we secure your file.",
      });

      // 2. Upload to UploadThing
      const uploadResponse = await startUpload([file]);
      
      if (!uploadResponse) {
        toast.error("Upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const uploadFileUrl = uploadResponse[0].url;

      toast.info("Processing PDF...", {
        description: "Our AI is analyzing document structure...",
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

      // 4. Save Summary (Server Action 2)
      toast.info("Finalizing...", {
        description: "Saving your summary to the dashboard.",
      });

      const storeResult = await storePdfSummaryAction({
        summary: generateResult.data.summary,
        fileUrl: uploadFileUrl,
        title: generateResult.data.title,
        fileName: file.name,
      });

      if (storeResult.success && storeResult.data) {
        toast.success("Success!", {
          description: "Summary generated successfully.",
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
      
      {/* 1. Divider / Label */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          {/* Changed fixed gray to theme border */}
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-muted-foreground text-sm font-medium uppercase tracking-wider">
            {isLoading ? "AI Analysis in Progress" : "Upload New PDF"}
          </span>
        </div>
      </div>

      {/* 2. Content Area */}
      {isLoading ? (
        <div className="animate-in fade-in zoom-in duration-500">
           {/* Loading Skeleton */}
           <LoadingSkeleton />
           
           {/* Cancel Hint */}
           <p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
              This may take up to 30 seconds for large files. Do not close the tab.
           </p>
        </div>
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