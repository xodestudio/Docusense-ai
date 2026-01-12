import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";

export default function UploadHeader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center mt-10">
      
      {/* 1. Modern Badge (Clean Outline) */}
      <MotionDiv variants={itemVariants}>
        <Badge
          variant="outline"
          className="relative px-4 py-1.5 text-sm font-medium rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm shadow-sm"
        >
          <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
          <span>AI-Powered Content Creation</span>
        </Badge>
      </MotionDiv>

      {/* 2. Title with Purple Highlight */}
      <MotionDiv 
        variants={itemVariants} 
        className="capitalize text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
      >
        Start Uploading{" "}
        <span className="relative inline-block px-2">
          {/* Text needs to be white to contrast with purple box */}
          <span className="relative z-10 text-white">Your PDFs</span>
          {/* Purple Background Box */}
          <span
            className="absolute inset-0 bg-primary -rotate-2 rounded-lg transform -skew-y-1 shadow-lg shadow-primary/30"
            aria-hidden="true"
          ></span>
        </span>
      </MotionDiv>

      {/* 3. Subtitle */}
      <MotionDiv 
        variants={itemVariants} 
        className="text-lg text-muted-foreground max-w-xl text-center leading-relaxed"
      >
        <p>
          Upload your documents below and let our AI extract insights, summaries, and key points in seconds. ✨
        </p>
      </MotionDiv>
    </div>
  );
}