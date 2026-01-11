import { getPriceIdForActiveUser } from "@/lib/user";
import { pricingPlans } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
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

  if (!priceId) {
    return (
        <Link href="/#pricing">
            <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-bold ml-2 h-8">
                <Crown className="w-3 h-3 mr-1" /> Buy a plan
            </Button>
        </Link>
    )
}

  // 👇 FIX: Agar purani Fake ID hai, to usay Real Basic ID consider karo
  // (Ye line zaroori hai kyunke aapke DB mein abhi _BASIC wali id save hai)
  if (priceId === 'price_1RA9yVCTlpmJdURCk8Oi1pwO_BASIC') {
      priceId = 'price_1RA9yVCTlpmJdURCo5eDA5T5'; // Real Basic ID (Constants wali)
  }

  const plan = pricingPlans.find((plan) => plan.priceId === priceId);
  const planName = plan ? plan.name : "Basic"; // Fallback to Basic

  return (
    <Badge
      variant="outline"
      className={cn(
        "ml-2 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300 hidden lg:flex flex-row items-center px-3 py-1",
        plan?.id === "pro" ? "from-indigo-100 to-indigo-200 border-indigo-300" : ""
      )}
    >
      <Crown
        className={cn(
          "w-3 h-3 mr-1 text-amber-600",
          plan?.id === "pro" && "text-indigo-600"
        )}
      />
      {planName} Plan
    </Badge>
  );
}