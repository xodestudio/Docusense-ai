import BgGradient from "@/components/common/bg-gradient";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from "@/components/upload/loading-skeleton";

function HeaderSkeleton() {
  return (
    <div className="space-y-4 max-w-4xl">
      {/* Metadata Row Skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Badge Skeleton */}
        <Skeleton className="h-6 w-24 rounded-full bg-primary/10" />
        
        {/* Date/Time Skeleton */}
        <div className="h-4 w-[1px] bg-border/60 mx-1" />
        <Skeleton className="h-4 w-32 bg-primary/5" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4 rounded-lg bg-primary/10" />
        <Skeleton className="h-10 w-1/2 rounded-lg bg-primary/10" />
      </div>
    </div>
  );
}

export default function LoadingSummary() {
  return (
    <div className="relative isolate min-h-screen bg-background overflow-hidden">
      
      {/* 1. Background Ambience */}
      <BgGradient className="top-0 left-1/2 -translate-x-1/2 opacity-20 blur-[100px]" />

      <div className="container mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* 2. Header Section */}
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6 border-b border-border/40 pb-8">
          <HeaderSkeleton />
          
          {/* Back Button Skeleton */}
          <Skeleton className="h-9 w-32 rounded-full bg-primary/5 self-start" />
        </div>

        {/* 3. Source Info Skeleton (Mimicking SourceInfo component) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-2">
           <Skeleton className="h-8 w-64 rounded-lg bg-muted/40" />
           <div className="flex gap-2">
              <Skeleton className="h-8 w-32 rounded-md bg-muted/40" />
              <Skeleton className="h-8 w-40 rounded-md bg-primary/5" />
           </div>
        </div>

        {/* 4. Main Viewer Card Skeleton */}
        <div className="flex justify-center mt-8">
           {/* Humne LoadingSkeleton pehle hi bana liya tha, usay direct use karenge without extra wrapper */}
           <LoadingSkeleton />
        </div>

      </div>
    </div>
  );
}