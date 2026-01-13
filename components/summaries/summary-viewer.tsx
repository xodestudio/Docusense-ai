"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronRight, ChevronLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface SummaryViewerProps {
  summary: string;
}

export function SummaryViewer({ summary }: SummaryViewerProps) {
  
  // --- 1. PARSING & CHUNKING LOGIC ---
  const pages = useMemo(() => {
    const lines = summary.split(/\n/).filter((line) => line.trim() !== "");

    // Step A: Raw Parsing
    const parsedBlocks = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) {
        return { type: "heading", content: trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, ""), original: trimmed };
      }
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        return { type: "list", content: trimmed.replace(/^[*•-]\s*/, ""), original: trimmed };
      }
      return { type: "paragraph", content: trimmed, original: trimmed };
    });

    // Step B: Grouping into "Logical Sections" (Heading + Content)
    // Hum pehle blocks ko "Sections" mein convert karenge.
    // Aik section = Heading + Uske neeche wala content.
    const sections: any[][] = [];
    let currentSection: any[] = [];

    parsedBlocks.forEach((block) => {
        // Jab bhi nayi heading aaye, purana section save kro aur naya shuru kro
        if (block.type === 'heading') {
            if (currentSection.length > 0) {
                sections.push(currentSection);
            }
            currentSection = [block];
        } else {
            currentSection.push(block);
        }
    });
    // Last wala section push kro
    if (currentSection.length > 0) sections.push(currentSection);


    // Step C: Pagination (2 Sections Per Page)
    const SECTIONS_PER_PAGE = 2;
    const resultPages = [];

    for (let i = 0; i < sections.length; i += SECTIONS_PER_PAGE) {
        // Do sections uthao
        const pageSections = sections.slice(i, i + SECTIONS_PER_PAGE);
        
        // Unko wapis 'flat' list mein convert kro taake render ho saken
        // Output: [Heading1, Para1, Heading2, Para2]
        const flatPage = pageSections.flat();
        resultPages.push(flatPage);
    }

    return resultPages;
  }, [summary]);

  // --- 2. STATE ---
  const [currentPage, setCurrentPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll when page changes
  useEffect(() => {
    if (contentContainerRef.current) {
        contentContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // --- 3. HANDLERS ---
  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(c => c + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(c => c - 1);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Summary copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      
      {/* Main Floating Card */}
      {/* UPDATE: Height increased to 800px to fit 2 sections comfortably */}
      <div className="relative w-full h-[800px] flex flex-col bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-800 z-20">
            <motion.div 
                className="h-full bg-gradient-to-r from-primary to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-black/40 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Page {currentPage + 1} of {pages.length}
                </span>
            </div>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="hover:bg-primary/10 hover:text-primary">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
        </div>

        {/* CONTENT AREA */}
        <div 
            ref={contentContainerRef}
            className="flex-1 relative p-8 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8" // Increased spacing between blocks
                >
                    {pages[currentPage]?.map((block, idx) => (
                        <div key={idx} className="leading-relaxed text-gray-700 dark:text-gray-200">
                            
                            {block.type === 'heading' && (
                                <div className={cn("flex items-center gap-2 mb-3", idx > 0 && "pt-4 border-t border-gray-100 dark:border-gray-800 mt-6")}>
                                    {/* Agar page ki second heading hai to upar thora divider aur margin do */}
                                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block shrink-0" />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {block.content}
                                    </h3>
                                </div>
                            )}

                            {block.type === 'list' && (
                                <div className="flex items-start gap-3 pl-2 py-1 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-transparent hover:border-gray-200 transition-colors p-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                                    <p className="text-lg">{renderText(block.content)}</p>
                                </div>
                            )}

                            {block.type === 'paragraph' && (
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    {renderText(block.content)}
                                </p>
                            )}
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 flex justify-between items-center backdrop-blur-sm z-10 shrink-0 mt-auto">
            <Button 
                variant="outline" 
                onClick={prevPage} 
                disabled={currentPage === 0}
                className="rounded-full px-6 hover:bg-white hover:shadow-md transition-all"
            >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>

            <div className="hidden sm:flex gap-1.5">
                {pages.map((_, i) => (
                    <motion.div 
                        key={i}
                        className={cn("h-1.5 rounded-full transition-all duration-300 cursor-pointer", i === currentPage ? "w-6 bg-primary" : "w-1.5 bg-gray-300 dark:bg-gray-700")}
                        onClick={() => setCurrentPage(i)}
                        layout
                    />
                ))}
            </div>

            <Button 
                onClick={nextPage} 
                disabled={currentPage === pages.length - 1}
                className={cn(
                    "rounded-full px-6 transition-all shadow-lg",
                    currentPage === pages.length - 1 ? "bg-gray-300" : "bg-gradient-to-r from-primary to-purple-600 hover:shadow-primary/30"
                )}
            >
                Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </div>

      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] bg-primary/5 blur-[80px] -z-10 rounded-full pointer-events-none" />

    </div>
  );
}