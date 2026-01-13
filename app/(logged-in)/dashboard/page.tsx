import BgGradient from "@/components/common/bg-gradient";
import { getSummaries } from "@/lib/summaries";
import { hasReachedUploadLimit } from "@/lib/user";
import { getUserSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/app/(logged-in)/dashboard/dashboard-client";

export default async function DashboardPage() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) return redirect("/sign-in");

  // 1. Fetch Data
  const { hasReachedLimit, uploadLimit } = await hasReachedUploadLimit(userId);
  const summaries = await getSummaries(userId);
  const subscription = await getUserSubscription(userId);
  
  // 👇 CRITICAL CHECKS
  // Agar subscription null hai, iska matlab plan expire ho gya hai ya active nahi hai.
  const hasActivePlan = !!subscription; 
  const isPro = subscription?.plan === "pro";

  // 2. Analytics Stats
  const totalDocs = summaries.length;
  const totalWords = summaries.reduce((acc, curr) => {
    const originalCount = curr.word_count && curr.word_count > 0 
        ? curr.word_count 
        : (curr.summary_text ? curr.summary_text.split(/\s+/).length * 5 : 0);
    return acc + originalCount;
  }, 0);
  const timeSaved = Math.round((totalWords / 200) * 0.8); 

  const stats = { totalDocs, totalWords, timeSaved };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <BgGradient className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <DashboardClient 
            initialSummaries={summaries}
            hasReachedLimit={hasReachedLimit}
            uploadLimit={uploadLimit}
            stats={stats}
            isPro={isPro}
            hasActivePlan={hasActivePlan}
        />
      </div>
    </main>
  );
}