"use client";

import { cn } from "@/lib/utils";
import { pricingPlans } from "@/utils/constants";
import { ArrowRight, CheckIcon } from "lucide-react";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";
import Link from "next/link"; // Link import zaroori hai

interface PriceType {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
}

const PricingCard = ({ name, price, description, items, id }: PriceType) => {
  return (
    <MotionDiv
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300"
    >
      <div className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl bg-white",
          id === "pro" && "border-rose-500 gap-5 border-2"
        )}>
        
        {/* Header Section */}
        <div>
          <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
          <p className="text-gray-500 mt-2">{description}</p>
        </div>

        {/* Price Section */}
        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">${price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">USD</p>
            <p className="text-xs">/month</p>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-2.5 leading-relaxed text-base flex-1/2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon size={18} className="text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* 👇 Button Section: Ab ye seedha Upgrade Page par le jayega */}
        <div className="mt-auto pt-4">
            <Link href={`/dashboard/upgrade?plan=${id}`} className="w-full block">
                <button
                    className={cn(
                    "w-full rounded-full flex items-center justify-center gap-2 py-3 font-bold transition-all border-2",
                    id === "pro"
                        ? "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20"
                        : "bg-white text-gray-900 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
                    )}
                >
                    {id === "pro" ? "Upgrade to Pro" : "Get Basic"} <ArrowRight size={18} />
                </button>
            </Link>
        </div>
      </div>
    </MotionDiv>
  );
};

export default function PricingSection() {
  return (
    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4">
        <div className="flex justify-center flex-col lg:flex-row gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}