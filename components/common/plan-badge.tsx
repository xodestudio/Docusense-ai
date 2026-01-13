import { getPriceIdForActiveUser } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import { Crown, Sparkles, Zap } from "lucide-react"; // Zap icon added for Free plan
import Link from "next/link";

// 👇 Aapki real Price IDs (from payments.json)
const PRO_PRICE_ID = "price_1RA9yVCTlpmJdURCk8Oi1pwO";
const BASIC_PRICE_ID = "price_1RA9yVCTlpmJdURCo5eDA5T5";

export default async function PlanBadge() {
  const user = await currentUser();

  // 1. User hi nahi hai to badge kyu dikhana?
  if (!user?.id) return null;

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  // 2. Database se Price ID nikalo
  const priceId = await getPriceIdForActiveUser(email);

  // 🛑 Case A: Koi Plan Nahi (Free User) -> Show "Modern Upgrade" Button
  if (!priceId) {
    return (
        <Link href="/#pricing" className="ml-2 group relative inline-flex items-center justify-center rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            {/* Animated Gradient Border */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-md" />
            
            {/* Button Content */}
            <span className="relative inline-flex h-7 cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900">
                <Crown className="w-3.5 h-3.5 mr-1.5 fill-yellow-500 text-yellow-500" />
                <span className="bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent font-bold">
                    Upgrade to Pro
                </span>
            </span>
        </Link>
    )
  }

  // 🔍 Case B: Plan Identify Karo
  const isPro = priceId === PRO_PRICE_ID;
  const planName = isPro ? "PRO" : "BASIC"; 

  // ✅ Case C: Premium Badge Render Karo
  return (
    <div className={cn(
        "ml-2 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300",
        // ✨ PRO STYLING (Premium Glassy Look)
        isPro 
          ? "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-300 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]" 
          
        // 🛡️ BASIC STYLING (Clean & Minimal)
          : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
    )}>
      
      {isPro ? (
          // Pro Icon with Gradient Fill
          <div className="bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full p-0.5">
             <Sparkles className="w-2.5 h-2.5 text-white fill-white" />
          </div>
      ) : (
          // Basic Icon
          <Zap className="w-3.5 h-3.5 fill-gray-400 text-gray-500" />
      )}
      
      <span className={cn(
          "font-bold tracking-wider text-[10px]",
          isPro && "bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent"
      )}>
        {planName}
      </span>
    </div>
  );
}