import { cn } from "@/lib/utils";

export default function ProgressBar({
  sections,
  currentSection,
}: {
  sections: Array<{ title: string; points: string[] }>;
  currentSection: number;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md pt-4 pb-2 border-b border-border/40">
      <div className="px-4 flex gap-1.5">
        {sections.map((_, index) => {
          
          // Logic to determine state
          const isCompleted = index < currentSection;
          const isActive = index === currentSection;
          
          return (
            <div 
              key={index} 
              className="h-1.5 flex-1 rounded-full bg-primary/10 overflow-hidden"
            >
              <div
                className={cn(
                  "h-full transition-all duration-500 ease-out",
                  
                  // 1. Completed: Solid Primary (Purple)
                  isCompleted && "w-full bg-primary",
                  
                  // 2. Active: Gradient (Indigo -> Purple)
                  isActive && "w-full bg-gradient-to-r from-primary to-purple-500",
                  
                  // 3. Pending: Empty
                  !isCompleted && !isActive && "w-0 bg-primary"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}