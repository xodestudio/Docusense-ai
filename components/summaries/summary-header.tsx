import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SummaryHeader({
  title,
  createdAt,
  readingTime,
}: {
  title: string;
  createdAt: string;
  readingTime: number;
}) {
  return (
    // 👇 FIX 3: 'pb-4' ko 'pb-2' kar diya aur 'mb-2' hata kar 'mb-0' kar diya.
    // Ab border content ke bilkul qareeb hoga aur uske neeche koi extra margin nahi.
    <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between md:items-start border-b border-border/40 pb-2 mb-0">
      
      <div className="space-y-3 max-w-4xl">
        
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={"outline"}
            className="gap-1.5 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 fill-primary/20 animate-pulse" />
            AI Generated
          </Badge>
          
          <div className="hidden sm:block h-4 w-[1px] bg-border" /> 

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary/70" />
            {readingTime} min Read
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl leading-tight">
          {title}
        </h1>
      </div>

      {/* Back Button */}
      <div className="self-start">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-border/60 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm"
        >
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}