import { Card } from "@/components/ui/card";
import DeleteButton from "@/components/summaries/delete-button";
import Link from "next/link";
import { FileText, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { cn, formatFileName } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";

const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string | null;
  createdAt: string;
}) => {
  return (
    <div className="flex items-start gap-3">
      {/* Icon with Background */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
         <FileText className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-base font-semibold text-foreground truncate w-[85%] leading-tight">
          {title || formatFileName(fileUrl)}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};

const StatsBadge = ({ status }: { status: string }) => {
  const isCompleted = status === "completed";
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors",
        isCompleted
          ? "bg-primary/5 text-primary border-primary/20"
          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      )}
    >
      {isCompleted ? (
          <CheckCircle2 className="w-3 h-3" />
      ) : (
          <Loader2 className="w-3 h-3 animate-spin" />
      )}
      {status}
    </span>
  );
};

export default function SummaryCard({ summary }: { summary: any }) {
  return (
    <MotionDiv 
        variants={itemVariants} 
        initial="hidden" 
        animate="visible" 
        // 👇 FIX: No Scale Animation here
        className="h-full"
    >
      <Card className="group relative h-full flex flex-col justify-between overflow-hidden border border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-md">
        
        {/* Delete Button (Absolute) */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DeleteButton summaryId={summary.id} />
        </div>

        <Link href={`summaries/${summary.id}`} className="flex flex-col h-full p-5">
          <div className="flex flex-col gap-4 h-full">
            
            <SummaryHeader
              fileUrl={summary.original_file_url}
              title={summary.title}
              createdAt={summary.created_at}
            />
            
            {/* Content Preview */}
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed pl-1 flex-grow">
              {summary.summary_text}
            </p>
            
            {/* Footer */}
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/40">
              <StatsBadge status={summary.status} />
            </div>
          </div>
        </Link>
      </Card>
    </MotionDiv>
  );
}