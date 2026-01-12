import { ArrowRight, Lock, CheckCircle2, Zap } from "lucide-react";
import BgGradient from "./bg-gradient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UpgradeRequired() {
  const benefits = [
    "Unlimited PDF Uploads & Summaries",
    "Smartest AI Model (Gemini 1.5 Pro)",
    "Process Larger Files (Up to 32MB)"
  ];

  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-10">
      
      {/* 1. Background: Subtle Professional Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent z-10" />
      <BgGradient className="from-primary/20 via-purple-500/20 to-blue-500/10 opacity-50 blur-3xl" />
      
      <div className="container px-4 relative z-20">
        
        {/* 2. The "Sales Card" */}
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 rounded-3xl border border-border/60 bg-white/60 p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl dark:bg-black/40">
          
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 ring-1 ring-primary/20">
               <Lock className="h-7 w-7 text-primary" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                You've hit the <span className="text-primary">Free Limit</span>
            </h2>
            
            {/* EDUCATIONAL COPY: Human & Real */}
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              To maintain high-quality AI responses for everyone, we have to limit usage on the free tier. 
              Upgrade to <span className="font-semibold text-foreground">Pro</span> to remove limits, upload larger documents, and get faster, deeper insights from our best AI model.
            </p>
          </div>

          {/* 3. The "Benefit Stack" (Real Features Only) */}
          <div className="grid gap-3 w-full max-w-md text-left bg-background/50 p-6 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What you get instantly:</span>
             </div>
             {benefits.map((benefit, index) => (
               <div key={index} className="flex items-center gap-3">
                 <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                 <span className="text-sm font-medium text-foreground/90">{benefit}</span>
               </div>
             ))}
          </div>

          {/* 4. Call to Action */}
          <div className="w-full max-w-sm space-y-4">
            <Button
                asChild
                size="lg"
                className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
            >
                <Link href="/#pricing" className="flex gap-2 items-center justify-center">
                Upgrade to Pro <ArrowRight className="w-4 h-4" />
                </Link>
            </Button>
            
            <p className="text-xs text-muted-foreground font-medium">
                🔒 Secure payment via Stripe • Cancel anytime
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}