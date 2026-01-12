"use client";
import { Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteSummaryAction } from "@/actions/summary-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  summaryId: string;
}

export default function DeleteButton({ summaryId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteSummaryAction(summaryId);
      if (!result.success) {
        toast.error("Error", {
          description: "Failed to delete summary",
        });
      } else {
        toast.success("Deleted", {
            description: "Summary deleted successfully",
        });
      }

      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* 👇 FIX: Clean Subtle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-600"
          suppressHydrationWarning={true}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2">
            {/* Warning Icon for better UX */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
             <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle>Delete Summary?</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this summary? This action cannot be undone and will remove the file from your history.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-600 hover:bg-red-700 shadow-sm"
          >
            {isPending ? "Deleting..." : "Delete Summary"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}