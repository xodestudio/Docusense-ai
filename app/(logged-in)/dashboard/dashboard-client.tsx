"use client";

import { useState, useMemo } from "react";
import { MotionDiv, MotionH1, MotionP } from "@/components/common/motion-wrapper";
import SummaryCard from "@/components/summaries/summary-card";
import EmptySummaryState from "@/components/summaries/empty-summary-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { itemVariants } from "@/utils/constants";
import { 
  BarChart3, 
  FileText, 
  Filter, 
  Plus, 
  Search, 
  Sparkles, 
  Zap, 
  Clock,
  X
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  initialSummaries: any[];
  hasReachedLimit: boolean;
  uploadLimit: number;
  stats: {
    totalDocs: number;
    totalWords: number;
    timeSaved: number;
  };
}

export default function DashboardClient({ 
  initialSummaries, 
  hasReachedLimit, 
  uploadLimit,
  stats 
}: DashboardClientProps) {
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Search Logic (Runs automatically when you type)
  const filteredSummaries = useMemo(() => {
    if (!searchQuery.trim()) return initialSummaries;

    const lowerQuery = searchQuery.toLowerCase();
    return initialSummaries.filter((summary) => 
      (summary.title?.toLowerCase().includes(lowerQuery)) || 
      (summary.file_name?.toLowerCase().includes(lowerQuery)) ||
      (summary.summary_text?.toLowerCase().includes(lowerQuery))
    );
  }, [initialSummaries, searchQuery]);

  return (
    <div className="relative z-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <MotionH1
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Dashboard
          </MotionH1>
          <MotionP
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-muted-foreground text-lg max-w-lg"
          >
            Manage your documents and track your productivity insights.
          </MotionP>
        </div>

        {!hasReachedLimit && (
          <MotionDiv variants={itemVariants} initial="hidden" animate="visible">
            <Button asChild size="lg" className="rounded-full gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40">
              <Link href="/upload">
                <Plus className="w-5 h-5" />
                Create New Summary
              </Link>
            </Button>
          </MotionDiv>
        )}
      </div>

      {/* 2. 📊 Real Analytics Cards */}
      {initialSummaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatsCard 
            label="Total Documents" 
            value={stats.totalDocs.toString()} 
            icon={<FileText className="w-5 h-5 text-blue-500" />} 
            delay={0.1}
          />
          <StatsCard 
            label="Words Analyzed" 
            value={stats.totalWords.toLocaleString()} 
            icon={<BarChart3 className="w-5 h-5 text-purple-500" />} 
            delay={0.2}
          />
          <StatsCard 
            label="Time Saved (Est.)" 
            value={`${stats.timeSaved} mins`} 
            icon={<Zap className="w-5 h-5 text-amber-500" />} 
            delay={0.3}
          />
        </div>
      )}

      {/* 3. 🔍 Working Search Bar */}
      {initialSummaries.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search summaries by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/60 backdrop-blur-sm border-border/60 focus-visible:ring-primary/20 transition-all" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {/* Dummy Filters for Visuals */}
          <Button variant="outline" className="gap-2 border-border/60 bg-background/60 backdrop-blur-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      )}

      {/* Limit Alert */}
      {hasReachedLimit && (
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-400 shadow-sm">
             <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                <Sparkles className="h-4 w-4" />
             </div>
             <p className="text-sm font-medium">
                Upload limit reached. 
                <Link href="/pricing" className="ml-1 underline underline-offset-4 hover:text-amber-800 dark:hover:text-amber-300 font-bold">
                  Upgrade Plan
                </Link> 
             </p>
          </div>
        </MotionDiv>
      )}

      {/* 4. Content Grid */}
      {filteredSummaries.length === 0 ? (
        initialSummaries.length === 0 ? (
            <EmptySummaryState />
        ) : (
            <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
                <p>No results found for "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary mt-2">Clear Search</Button>
            </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredSummaries.map((summary, index) => (
            <SummaryCard key={summary.id || index} summary={summary} />
          ))}
        </div>
      )}
    </div>
  );
}

// Stats UI Helper
function StatsCard({ label, value, icon, delay }: { label: string; value: string; icon: React.ReactNode, delay: number }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      className="flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:border-primary/20 hover:bg-card/60 transition-colors"
    >
      <div className="p-3 rounded-xl bg-background shadow-sm border border-border/50">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      </div>
    </MotionDiv>
  )
}