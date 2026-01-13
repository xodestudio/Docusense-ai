"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Check, Sparkles, Zap, FileText } from "lucide-react";
import { MotionSection } from "../common/motion-wrapper";
import Link from "next/link";
import BgGradient from "../common/bg-gradient";
import { Button } from "@/components/ui/button";

const realPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "5.00",
    description: "Essential tools for students.",
    items: [
      "5 PDF Summaries/mo",
      "Up to 10MB File Size",
      "Standard Speed",
      "Email Support"
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "12.99",
    description: "For power users & pros.",
    items: [
      "Unlimited Summaries",
      "Up to 25MB File Size",
      "Fast AI Processing",
      "Priority 24/7 Support"
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden py-20" id="pricing">
      
      {/* Background Ambience */}
      <BgGradient className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]" />

      <div className="container px-4 mx-auto relative z-10 max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Simple, transparent pricing
            </h2>
            <p className="text-base text-muted-foreground">
                Upgrade to unlock larger files and unlimited summaries.
            </p>
        </div>

        {/* Pricing Cards Grid (COMPACT) */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          // 👇 Change: 'max-w-4xl' aur 'gap-6' se size control kiya
          className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
        >
          {realPlans.map((plan) => {
            const isPro = plan.id === "pro";

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col w-full rounded-3xl p-6 lg:p-8 transition-all duration-300",
                  // 👇 Design: Compact borders and clean shadow
                  isPro 
                    ? "bg-background border-2 border-primary/20 shadow-xl shadow-primary/10" 
                    : "bg-background/60 border border-border/60 hover:border-border shadow-sm"
                )}
              >
                {/* Popular Badge */}
                {isPro && (
                  <div className="absolute top-6 right-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary border border-primary/20">
                      <Sparkles className="w-3 h-3 fill-primary/20" /> Popular
                    </span>
                  </div>
                )}

                {/* Header Section */}
                <div className="mb-5">
                   <div className={cn(
                       "h-10 w-10 rounded-xl flex items-center justify-center mb-4",
                       isPro ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-500"
                   )}>
                       {isPro ? <Zap className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                   </div>
                   <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                   <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {/* Price Section (Compact) */}
                <div className="mb-6 flex items-baseline gap-1 pb-6 border-b border-border/50">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">${plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">/mo</span>
                </div>

                {/* Features List */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground/90">
                      <div className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          isPro ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"
                      )}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Link href={`/dashboard/upgrade?plan=${plan.id}`} className="w-full mt-auto">
                  <Button
                    size="lg"
                    className={cn(
                      "w-full h-11 rounded-xl font-bold text-sm transition-all",
                      isPro
                        ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/20 border-0 text-white"
                        : "bg-white border border-border hover:border-gray-300 text-foreground hover:bg-gray-50"
                    )}
                  >
                    {isPro ? "Upgrade to Pro" : "Get Basic"} 
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </MotionSection>

      </div>
    </section>
  );
}