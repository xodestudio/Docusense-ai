"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { NavigationControls } from "./navigation-controls";
import ProgressBar from "./progress-bar";
import { parseSection } from "@/utils/summary-helper";
import ContentSection from "./content-section";
import { MotionDiv } from "../common/motion-wrapper";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="sticky top-0 z-10 mb-6 bg-background/95 pt-2 pb-4 backdrop-blur-md border-b border-border/40">
      <h2 className="text-2xl lg:text-3xl font-bold text-center text-foreground tracking-tight">
        {title}
      </h2>
    </div>
  );
};

export function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = summary
    .split("\n#")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  return (
    <Card className="relative flex flex-col h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] overflow-hidden rounded-[2rem] border border-border/60 bg-card/50 shadow-2xl backdrop-blur-xl">

      {/* Top Progress Bar */}
      <ProgressBar sections={sections} currentSection={currentSection} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Padding Top/Bottom added to avoid overlap with fixed bars */}
        <div className="px-5 sm:px-8 pt-16 pb-24">
            
          <MotionDiv
            key={currentSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <SectionTitle title={sections[currentSection]?.title || ""} />
            <ContentSection
              title={sections[currentSection]?.title || ""}
              points={sections[currentSection]?.points || []}
            />
          </MotionDiv>
          
        </div>
      </div>

      {/* Bottom Navigation */}
      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}
      />
    </Card>
  );
}