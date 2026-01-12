import { getPriceIdForActiveUser } from "@/lib/user";
import { pricingPlans } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function PlanBadge() {
  const user = await currentUser();

  if (!user?.id) return null;

  const email = user.emailAddresses?.[0]?.emailAddress;

  let priceId: string | null = null;
  if (email) {
     priceId = await getPriceIdForActiveUser(email);
  }

  // 👇 CASE 1: No Plan (Show Upgrade Button)
  if (!priceId) {
    return (
        <Link href="/#pricing">
            <Button 
                size="sm" 
                className="ml-2 h-8 font-semibold text-xs bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:opacity-90 hover:shadow-md transition-all duration-300 shadow-purple-500/20"
            >
                <Crown className="w-3.5 h-3.5 mr-1.5 fill-white/20" /> 
                Buy a plan
            </Button>
        </Link>
    )
  }

  // 👇 FIX: ID Mapping Logic (As requested)
  if (priceId === 'price_1RA9yVCTlpmJdURCk8Oi1pwO_BASIC') {
      priceId = 'price_1RA9yVCTlpmJdURCo5eDA5T5'; 
  }

  const plan = pricingPlans.find((plan) => plan.priceId === priceId);
  const planName = plan ? plan.name : "Basic"; 
  const isPro = plan?.id === "pro";

  // 👇 CASE 2: Active Plan Badge
  return (
    <Badge
      variant="outline"
      className={cn(
        "ml-2 hidden lg:flex items-center gap-1.5 px-3 py-1 transition-all duration-300 backdrop-blur-md",
        // Default (Basic): Clean Greyish Blue
        "bg-secondary/50 border-border text-muted-foreground",
        // Pro: Premium Primary Color with Glow
        isPro && "bg-primary/10 border-primary/20 text-primary shadow-[0_0_10px_-4px_rgba(124,58,237,0.3)]"
      )}
    >
      {isPro ? (
          <Sparkles className="w-3.5 h-3.5 text-primary fill-primary/20" />
      ) : (
          <Crown className="w-3.5 h-3.5 text-muted-foreground/70" />
      )}
      
      <span className="font-medium tracking-wide text-[11px] uppercase">
        {planName}
      </span>
    </Badge>
  );
}