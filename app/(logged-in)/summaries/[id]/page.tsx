import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { SourceInfo } from "@/components/summaries/source-info";
import { SummaryHeader } from "@/components/summaries/summary-header";
import { SummaryViewer } from "@/components/summaries/summary-viewer";
import { getSummaryById } from "@/lib/summaries";
import { notFound } from "next/navigation";

interface SummaryPageProps {
  params: Promise<{ id: string }>;
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = await params;

  const summary = await getSummaryById(id);

  if (!summary) {
    notFound();
  }

  const {
    title,
    summary_text,
    file_name,
    word_count,
    created_at,
    original_file_url,
  } = summary;

  const readingTime = Math.ceil((word_count || 0) / 200);

  return (
    <div className="relative isolate min-h-screen bg-background overflow-hidden">
      
      <BgGradient className="top-0 left-1/2 -translate-x-1/2 opacity-20 blur-[100px]" />

      {/* 👇 FIX 1: 'py-10' ko 'pt-4' kar diya taake header upar shift ho */}
      <div className="container mx-auto flex flex-col gap-4 px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pt-8">
        
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center max-w-5xl mx-auto w-full"
        >
          
          {/* Header Section */}
          <div className="w-full">
            <SummaryHeader
              title={title}
              createdAt={created_at}
              readingTime={readingTime}
            />
          </div>

          {/* 👇 FIX 2: 'mb-8' ko kam karke 'my-4' kar diya taake SourceInfo kareeb aaye */}
          {file_name && (
            <div className="w-full my-4 sticky top-4 z-30">
              <SourceInfo
                title={title}
                summaryText={summary_text}
                fileName={file_name}
                createdAt={created_at}
                originalFileUrl={original_file_url}
              />
            </div>
          )}

          {/* Main Viewer */}
          <div className="w-full flex justify-center">
            <SummaryViewer summary={summary_text} />
          </div>

        </MotionDiv>
      </div>
    </div>
  );
}