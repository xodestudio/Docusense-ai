import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import { hasReachedUploadLimit } from "@/lib/user";
import { getUserSubscription } from "@/lib/subscription";
import { containerVariants } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const maxDuration = 300; 

export default async function UploadPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const userId = user.id;
  
  // 1. Fetch limit status
  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(userId);

  // 2. Fetch Subscription Status for 'isPro' prop
  const subscription = await getUserSubscription(userId);
  const isPro = subscription?.plan === "pro";

  // 🛑 Redirect if limit reached (Server Side Guard)
  if (hasReachedLimit) {
      return (
        <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20 max-w-md">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-2">Upload Limit Reached</h1>
                <p className="text-muted-foreground mb-6">
                    You have reached your limit of {uploadLimit} uploads. Upgrade to Pro for unlimited access.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild variant="default">
                        <Link href="/dashboard/upgrade">Upgrade Plan</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </section>
      )
  }

  return (
    <section className="relative isolate min-h-screen flex flex-col overflow-hidden bg-background">
      
      {/* Background Ambience */}
      <BgGradient className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]" />

      {/* Main Container */}
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto px-6 lg:px-8 relative z-10"
      >
        <div className="flex flex-col items-center gap-10 text-center">
          
          <UploadHeader />
          
          {/* 👇 MODIFIED: Removed 'bg-card border shadow' etc. Just kept 'w-full max-w-2xl' for alignment */}
          <div className="w-full max-w-2xl">
             <UploadForm isPro={isPro} />
          </div>
          
        </div>
      </MotionDiv>
    </section>
  );
}