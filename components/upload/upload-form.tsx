"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";

const LIMITS = {
  FREE: 10 * 1024 * 1024, // 10MB
  PRO: 25 * 1024 * 1024,  // 25MB
};

interface UploadFormProps {
  isPro: boolean;
}

export default function UploadForm({ isPro }: UploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const endpoint = isPro ? "proUploader" : "freeUploader";
  const maxFileSize = isPro ? LIMITS.PRO : LIMITS.FREE;
  
  // Dynamic Limit Text Logic
  const limitText = isPro ? "25MB" : "10MB";

  const { startUpload } = useUploadThing(endpoint, {
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

      const schema = z.object({
        file: z
          .instanceof(File, { message: "Invalid file" })
          .refine(
            (file) => file.size <= maxFileSize,
            `File size must be less than ${limitText}. ${!isPro ? "Upgrade to Pro for larger files." : ""}`
          )
          .refine(
            (file) => file.type.startsWith("application/pdf"),
            "File must be a PDF"
          ),
      });

      const validatedFields = schema.safeParse({ file });
      
      if (!validatedFields.success) {
        toast.error(
          validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file."
        );
        return;
      }

      setIsLoading(true);
      toast.info("Uploading PDF...", { description: "Please wait while we secure your file." });

      const uploadResponse = await startUpload([file]);
      
      if (!uploadResponse) {
        toast.error("Upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const uploadFileUrl = uploadResponse[0].url;
      toast.info("Processing PDF...", { description: "Our AI is analyzing document structure..." });

      const generateResult = await generatePdfSummary({
        fileUrl: uploadFileUrl,
        fileName: file.name,
      });

      if (!generateResult.success || !generateResult.data) {
        toast.error(generateResult.message || "Failed to generate summary");
        setIsLoading(false);
        return;
      }

      toast.info("Finalizing...", { description: "Saving your summary to the dashboard." });

      const storeResult = await storePdfSummaryAction({
        summary: generateResult.data.summary,
        fileUrl: uploadFileUrl,
        title: generateResult.data.title,
        fileName: file.name,
      });

      if (storeResult.success && storeResult.data) {
        toast.success("Success!", { description: "Summary generated successfully." });
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
      
      {/* Label Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-muted-foreground text-sm font-medium uppercase tracking-wider">
            {isLoading ? "AI Analysis in Progress" : "Upload New PDF"}
          </span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="animate-in fade-in zoom-in duration-500">
           {/* ✅ Clean Skeleton without extra text below */}
           <LoadingSkeleton />
        </div>
      ) : (
        <div className="space-y-3">
            {/* Input Component */}
            <UploadFormInput
              isLoading={isLoading}
              ref={formRef}
              onSubmit={handleSubmit}
            />
            
            {/* Single Dynamic Helper Text */}
            <p className="text-center text-xs text-muted-foreground">
                Supported files: PDF documents up to <span className="font-bold text-foreground">{limitText}</span>.
            </p>
        </div>
      )}
    </div>
  );
}