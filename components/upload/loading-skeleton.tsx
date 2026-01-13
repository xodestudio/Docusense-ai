"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Search, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function LoadingSkeleton() {
  
  // 🔄 Engaging Steps Logic
  const steps = [
      { text: "Scanning document...", icon: Search },
      { text: "Extracting text layers...", icon: FileText },
      { text: "Analyzing context...", icon: Brain },
      { text: "Generating summary...", icon: Sparkles },
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 2500);
      return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="w-full max-w-4xl mx-auto py-10 relative z-10 perspective-1000">
      
      {/* 🚀 Main Card Container */}
      <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:min-h-[550px] flex flex-col bg-white dark:bg-gray-950/50 rounded-[2rem] border border-primary/10 dark:border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm group">
        
        {/* 🕸️ Background Tech Grid (Subtle Animation) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* 🔦 THE SCANNER BEAM (Wow Factor) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
             <motion.div 
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-primary/10 to-transparent w-full blur-xl"
             />
             <motion.div 
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-[1px] bg-primary/40 shadow-[0_0_20px_2px_rgba(124,58,237,0.3)] w-full"
             />
        </div>

        {/* --- SKELETON CONTENT (Looking Faded) --- */}
        <div className="flex-1 p-8 sm:p-12 space-y-8 relative opacity-30 select-none grayscale-[0.5] mix-blend-multiply dark:mix-blend-screen">
             {/* Fake Heading */}
             <div className="space-y-3">
                 <div className="flex items-center gap-3">
                     <div className="w-1.5 h-8 bg-gray-400 rounded-full" />
                     <div className="h-8 w-3/4 bg-gray-300 rounded-lg" />
                 </div>
             </div>
             {/* Fake Paragraphs */}
             <div className="space-y-4">
                 <div className="h-4 w-full bg-gray-300 rounded" />
                 <div className="h-4 w-[92%] bg-gray-300 rounded" />
                 <div className="h-4 w-[98%] bg-gray-300 rounded" />
                 <div className="h-4 w-[85%] bg-gray-300 rounded" />
             </div>
             {/* Fake List */}
             <div className="space-y-4 pt-6">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="flex items-start gap-3">
                         <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-400 shrink-0" />
                         <div className="space-y-2 w-full">
                             <div className="h-4 w-[90%] bg-gray-300 rounded" />
                             <div className="h-4 w-[60%] bg-gray-300 rounded" />
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* 🔮 CENTER NEURAL ORB (The Brain) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            
            {/* Glassmorphism Card */}
            <div className="relative p-8 rounded-3xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center gap-6 max-w-xs w-full mx-4 ring-1 ring-black/5">
                
                {/* Animated Orb Container */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* Outer Rotating Ring */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary/50 animate-spin [animation-duration:3s]" />
                    
                    {/* Reverse Rotating Ring */}
                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-500/50 animate-spin [animation-duration:2s] [animation-direction:reverse]" />
                    
                    {/* Glowing Core */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    
                    {/* Central Icon (Animated Switch) */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CurrentIcon className="w-8 h-8 text-primary fill-primary/20" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Animated Text */}
                <div className="flex flex-col items-center gap-2 text-center h-12">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                        AI Processing
                    </h3>
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={currentStep}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            className="text-xs text-muted-foreground font-medium uppercase tracking-wider"
                        >
                            {steps[currentStep].text}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Progress Bar inside card */}
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                    />
                </div>

            </div>
        </div>

      </div>

    </div>
  );
}