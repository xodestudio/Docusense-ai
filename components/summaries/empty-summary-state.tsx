import { FileText, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptySummaryState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/60 rounded-3xl bg-gray-50/50 dark:bg-gray-900/20">
      
      {/* 1. Icon Circle (No Ping/Scale) */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 group">
        {/* Subtle Glow only */}
        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <FileText className="h-10 w-10 text-primary relative z-10" />
        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-purple-500 fill-purple-500/20 animate-bounce" />
      </div>

      {/* 2. Text Content */}
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        No summaries generated yet
      </h2>
      <p className="mt-2 text-muted-foreground max-w-sm text-sm leading-relaxed">
        Your dashboard is empty. Upload a PDF to get instant AI insights, summaries, and chat capabilities.
      </p>

      {/* 3. Gradient Action Button (Fixed Size) */}
      <Link href="/upload">
        <Button
          size="lg"
          className="mt-8 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg shadow-primary/20 transition-all border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your first summary
        </Button>
      </Link>
    </div>
  );
}