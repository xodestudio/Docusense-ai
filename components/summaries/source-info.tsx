import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadSummaryButton } from "./download-summary-button";

export function SourceInfo({
  fileName,
  originalFileUrl,
  title,
  summaryText,
  createdAt,
}: {
  fileName: string;
  originalFileUrl: string;
  title: string;
  summaryText: string;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-border/40">
      
      {/* Left: File Info Badge */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-1.5 text-xs lg:text-sm text-muted-foreground border border-border/50">
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="truncate max-w-[200px] sm:max-w-xs">
          Source: <span className="font-medium text-foreground">{fileName}</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        
        {/* View Original Button (Ghost Style) */}
        <Button
          variant={"ghost"}
          size={"sm"}
          className="h-8 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          asChild
        >
          <a href={originalFileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            View Original
          </a>
        </Button>

        {/* Download Button (Already styled in previous step) */}
        <DownloadSummaryButton
          title={title}
          summaryText={summaryText}
          fileName={fileName}
          createdAt={createdAt}
        />
      </div>
    </div>
  );
}