"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, UploadCloud } from "lucide-react";
import { forwardRef, useState } from "react";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    
    // 👇 State to track filename for Custom UI
    const [fileName, setFileName] = useState<string>("No file chosen");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName("No file chosen");
        }
    };

    return (
      <form ref={ref} className="w-full max-w-lg mx-auto" onSubmit={onSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          
          {/* CUSTOM FILE INPUT WRAPPER */}
          <div className="relative flex-1 group">
            
            {/* 1. The Real Input (Hidden but Clickable) */}
            <Input
              id="file"
              type="file"
              name="file"
              accept="application/pdf"
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0"
              disabled={isLoading}
              onChange={handleFileChange}
            />
            
            {/* 2. The Visual Layer (Perfectly Centered via Flexbox) */}
            <div className={cn(
                "h-full w-full bg-background/50 backdrop-blur-sm border border-border/60 rounded-lg flex items-center px-4 py-3 transition-all group-hover:bg-background/80",
                isLoading && "opacity-50 cursor-not-allowed"
            )}>
                {/* Fake Button (Text Centered) */}
                <div className="shrink-0 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mr-3 leading-none">
                    Choose file
                </div>
                
                {/* Filename Text (Vertically Centered) */}
                <span className="text-sm text-muted-foreground truncate leading-none">
                    {fileName}
                </span>
            </div>
          </div>

          {/* Gradient Action Button */}
          <Button 
            disabled={isLoading} 
            type="submit"
            className="h-auto shrink-0 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg shadow-primary/20 transition-all border-0 px-6 py-3 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload PDF
              </>
            )}
          </Button>
        </div>
        
        {/* Helper Text */}
        <div className="w-full flex justify-center">
            <p className="mt-3 text-xs text-muted-foreground text-center">
                Supported files: PDF documents up to 10MB.
            </p>
        </div>
      </form>
    );
  }
);

UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;