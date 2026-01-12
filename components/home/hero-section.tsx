import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MotionDiv, MotionH1, MotionH2, MotionSection } from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/constants";
import BgGradient from "../common/bg-gradient";

export default function HeroSection() {
  return (
    <MotionSection 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="relative mx-auto flex flex-col z-0 items-center justify-center pt-10 pb-24 lg:pt-16 lg:pb-32 overflow-hidden px-4 max-w-7xl text-center"
    >

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40 pointer-events-none">
          <BgGradient className="top-[-20%] w-[80%] h-[60%] blur-[100px] from-primary/30 via-purple-500/20 to-transparent" />
      </div>

      {/* 1. Tech Badge */}
      <MotionDiv variants={itemVariants} className="mb-4">
        <Badge
          variant={"outline"}
          className="relative px-4 py-1.5 text-sm font-medium rounded-full border-primary/20 bg-white/50 dark:bg-black/20 text-primary backdrop-blur-md shadow-sm hover:bg-primary/5"
        >
          <Bot className="h-4 w-4 mr-2 text-primary" />
          <span>AI-Powered Summaries & Insights</span>
        </Badge>
      </MotionDiv>

      {/* 2. Headline */}
      <MotionH1 variants={itemVariants} className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.15]">
        Unlock the hidden <br className="hidden sm:block" /> knowledge in your{" "}
        <span className="relative inline-block whitespace-nowrap">
          <span className="relative z-10 text-white px-3 py-1">
             documents
          </span>
          {/* Highlight Box (Purple) */}
          <span
            className="absolute inset-0 bg-primary -rotate-2 rounded-xl transform -skew-y-1 shadow-lg shadow-primary/30 origin-bottom-right"
            aria-hidden="true"
          ></span>
        </span>
      </MotionH1>

      {/* 3. Description */}
      <MotionH2 variants={itemVariants} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Stop wasting hours reading long PDFs. Upload contracts, research papers, or reports and let our AI <span className="text-foreground font-medium">summarize and explain</span> them instantly.
      </MotionH2>

      {/* 4. CTA Button (Stable) */}
      <MotionDiv variants={itemVariants} className="mt-8 sm:mt-10 flex flex-col items-center">
        <Button
          asChild
          size="lg"
          className="h-14 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-xl shadow-primary/25 transition-all duration-300 border-0"
        >
          <Link href="/dashboard" className="flex gap-2 items-center">
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        
        <p className="mt-4 text-xs font-medium text-muted-foreground/60">
            No credit card required • 100% Free for Students
        </p>
      </MotionDiv>
    </MotionSection>
  );
}