"use client";

import { cn } from "@/lib/utils";
import { pricingPlans } from "@/utils/constants";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import Link from "next/link";
import BgGradient from "../common/bg-gradient";

interface PriceType {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
}

const PricingCard = ({ name, price, description, items, id }: PriceType) => {
  const isPro = id === "pro";

  return (
    <div
      className={cn(
        "relative flex flex-col w-full max-w-lg p-8 rounded-3xl transition-all duration-300",
        // Pro Plan Styling (Highlighted)
        isPro 
          ? "bg-background border-2 border-primary shadow-2xl shadow-primary/10 z-10 scale-100 lg:scale-105" 
          : "bg-background/60 border border-border hover:border-primary/50"
      )}
    >
      {/* Most Popular Badge (Only for Pro) */}
      {isPro && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-primary to-purple-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/30">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold capitalize text-foreground">{name}</h3>
            {isPro && <Sparkles className="w-4 h-4 text-primary animate-pulse" />}
        </div>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">${price}</span>
        <span className="text-sm font-semibold text-muted-foreground">/month</span>
      </div>

      {/* Features List */}
      <ul className="flex-1 space-y-4 mb-8">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
            <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                isPro ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Check size={12} strokeWidth={3} />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <Link href={`/dashboard/upgrade?plan=${id}`} className="w-full block mt-auto">
        <button
          className={cn(
            "group w-full rounded-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all duration-300",
            isPro
              ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
              : "bg-white border border-border text-foreground hover:bg-gray-50 hover:border-gray-300"
          )}
        >
          {isPro ? "Upgrade to Pro" : "Get Started"} 
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </Link>
    </div>
  );
};

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32" id="pricing">
      
      {/* Background Ambience */}
      <BgGradient className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 blur-[100px]" />

      <div className="container px-4 mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
                Start for free, upgrade for power. No hidden fees.
            </p>
        </div>

        {/* Pricing Cards Grid */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 lg:gap-10"
        >
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </MotionSection>

      </div>
    </section>
  );
}