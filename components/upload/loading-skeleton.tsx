import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <Card className="relative flex flex-col h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] max-w-lg mx-auto overflow-hidden rounded-[2rem] border border-border/60 bg-card/50 shadow-2xl backdrop-blur-xl">
      
      {/* 🚀 SCANNER ANIMATION: Moving Laser Beam */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[2rem]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent shadow-[0_0_20px_2px_rgba(124,58,237,0.5)] animate-scan" />
      </div>

      {/* Loading Progress Bar (Top) */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md pt-4 pb-2 border-b border-border/40">
        <div className="px-4 flex gap-1.5">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-1.5 flex-1 rounded-full bg-primary/10 overflow-hidden"
            >
              <div
                className={cn(
                  "h-full bg-gradient-to-r from-primary/50 to-primary animate-pulse",
                  index === 0 ? "w-full" : "w-0"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Content */}
      {/* 👇 FIX: Scrollbar Hiding Code Added Here */}
      <div className="flex-1 overflow-y-auto pt-16 pb-24 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="px-5 sm:px-8">
          
          {/* Loading Title (Sticky) */}
          <div className="sticky top-0 z-10 mb-6 bg-background/95 pt-2 pb-4 backdrop-blur-md border-b border-border/40 flex justify-center">
            <Skeleton className="h-8 w-3/4 rounded-lg bg-primary/10" />
          </div>

          {/* Loading Points */}
          <div className="space-y-4">
            
            {/* Mocking the "EmojiPoint" style */}
            {[1, 2, 3].map((_, index) => (
              <div
                key={`point-${index}`}
                className="relative rounded-xl border border-border/40 bg-white/50 p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Skeleton */}
                  <Skeleton className="h-10 w-10 shrink-0 rounded-lg bg-primary/10" />
                  
                  {/* Text Lines */}
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-4 w-full bg-muted/60" />
                    <Skeleton className="h-4 w-4/5 bg-muted/60" />
                  </div>
                </div>
              </div>
            ))}

            {/* Mocking "RegularPoint" style */}
            {[1, 2].map((_, index) => (
              <div
                key={`reg-${index}`}
                className="rounded-xl border border-border/30 bg-white/40 p-4"
              >
                <div className="space-y-2">
                   <Skeleton className="h-4 w-full bg-muted/50" />
                   <Skeleton className="h-4 w-2/3 bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-20">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {/* Previous Button Skeleton */}
          <Skeleton className="rounded-full w-10 h-10 bg-primary/5" />

          {/* Pagination Dots Skeleton */}
          <div className="flex gap-1.5">
            <Skeleton className="h-2 w-8 rounded-full bg-primary/20" /> {/* Active Pill */}
            <Skeleton className="h-2 w-2 rounded-full bg-primary/10" />
            <Skeleton className="h-2 w-2 rounded-full bg-primary/10" />
          </div>
          
          {/* Next Button Skeleton */}
          <Skeleton className="rounded-full w-10 h-10 bg-primary/20" />
        </div>
      </div>
    </Card>
  );
}