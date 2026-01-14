import { Check, Crown, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UpgradeRequired() {
  const benefits = [
    "Unlimited PDF Uploads & Summaries",
    "Advanced AI Model (Gemini 2.5 Flash)",
    "Upload Larger Files (Up to 25MB)"
  ];

  return (
    <div className="relative flex min-h-[50vh] items-center justify-center py-12">
      
      {/* Background Ambience (Static) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="container px-4 relative z-20">
        
        {/* Main Card */}
        <div className="mx-auto flex max-w-[480px] flex-col items-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 shadow-xl">
          
          {/* Header Icon */}
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
             <Crown className="w-7 h-7" />
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
             Upgrade to Pro
          </h2>
          
          {/* Clear Description of Limits */}
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center leading-relaxed mb-8 px-4">
            Your <strong>Basic Plan</strong> supports files up to <span className="text-foreground font-medium">10MB</span>. 
            <br />
            Unlock the <strong>Pro Plan</strong> to upload files up to <span className="text-primary font-bold">25MB</span> and use our most advanced AI models.
          </p>

          {/* Benefits List */}
          <div className="w-full bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 mb-8 space-y-3">
             {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </div>
             ))}
          </div>

          {/* Action Button (No Animation) */}
          <div className="w-full space-y-4">
            <Button
              asChild
              className="w-full h-11 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-md transition-colors"
            >
                <Link href="/dashboard/upgrade" className="flex gap-2 items-center justify-center">
                   <Sparkles className="w-4 h-4" /> Get Pro Access
                </Link>
            </Button>
            
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium uppercase tracking-wide">
               <ShieldCheck className="w-3 h-3" /> Secure payment via Stripe
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}