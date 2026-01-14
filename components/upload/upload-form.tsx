"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import { Lock, CloudAlert } from "lucide-react"; // New Icons

interface UploadFormProps {
  isPro: boolean;
  maxSize: number;
  planLabel: string;
}

export default function UploadForm({ isPro, maxSize, planLabel }: UploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const endpoint = isPro ? "proUploader" : "freeUploader";

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
            (file) => file.size <= maxSize,
            "FILE_TOO_LARGE" 
          )
          .refine(
            (file) => file.type.startsWith("application/pdf"),
            "File must be a PDF"
          ),
      });

      const validatedFields = schema.safeParse({ file });
      
      if (!validatedFields.success) {
        const errorMsg = validatedFields.error.flatten().fieldErrors.file?.[0];
        
        // ✨ NEW: PREMIUM CARD STYLE TOAST
        if (errorMsg === "FILE_TOO_LARGE") {
            toast.custom((t) => (
                <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-xl shadow-xl p-5 flex flex-col gap-3 w-full max-w-sm pointer-events-auto ring-1 ring-black/5">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg shrink-0">
                            <CloudAlert className="w-5 h-5 text-red-500 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                File Limit Reached
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                Your <span className="font-medium text-gray-700 dark:text-gray-300">{isPro ? "Pro" : "Basic"}</span> plan allows files up to <span className="font-bold text-gray-900 dark:text-white">{planLabel}</span>.
                                This file is bigger than that.
                            </p>
                        </div>
                    </div>

                    {/* Action Button (Sirf agar user PRO nahi hai) */}
                    {!isPro && (
                        <button 
                            onClick={() => {
                                toast.dismiss(t); // Toast band kro
                                router.push('/dashboard/upgrade'); // Upgrade page par le jao
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-black py-2 rounded-lg text-xs font-bold hover:shadow-lg transition-all active:scale-95"
                        >
                            <Lock className="w-3 h-3" /> Upgrade to Pro (25MB)
                        </button>
                    )}

                    {/* Close Button (Optional, agar user upgrade na karna chahe) */}
                    {isPro && (
                        <button 
                            onClick={() => toast.dismiss(t)}
                            className="w-full py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            ), { duration: 8000 }); // Thora lamba time taake user parh sake
        } else {
            toast.error(errorMsg ?? "Invalid file.");
        }
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

      {isLoading ? (
        <div className="animate-in fade-in zoom-in duration-500">
           <LoadingSkeleton />
        </div>
      ) : (
        <div className="space-y-3">
            <UploadFormInput
              isLoading={isLoading}
              ref={formRef}
              onSubmit={handleSubmit}
            />
        </div>
      )}
    </div>
  );
}