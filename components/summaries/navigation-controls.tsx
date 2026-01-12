import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavigationControls({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSectionSelect,
}: {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSectionSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-20">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        
        {/* Previous Button (Subtle) */}
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={onPrevious}
          disabled={currentSection === 0}
          className={cn(
            "rounded-full w-10 h-10 border border-primary/20 bg-primary/5 text-primary transition-colors hover:bg-primary/10",
            currentSection === 0 && "opacity-30 cursor-not-allowed hover:bg-primary/5"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Modern Pagination Indicators (Dots -> Pills) */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => onSectionSelect(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSection === index
                  ? "w-8 bg-primary" // Active: Long Pill
                  : "w-2 bg-primary/20 hover:bg-primary/40" // Inactive: Small Dot
              )}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button (Prominent Gradient) */}
        <Button
          variant={"default"}
          size={"icon"}
          onClick={onNext}
          disabled={currentSection === totalSections - 1}
          className={cn(
            "rounded-full w-10 h-10 shadow-lg shadow-primary/20 border-0",
            // Gradient Background for Forward Action
            "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-700 transition-colors",
            currentSection === totalSections - 1 && "opacity-30 cursor-not-allowed shadow-none"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}