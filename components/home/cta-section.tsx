import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { MotionSection } from "../common/motion-wrapper";

export default function CTASection() {
  return (
    // 👇 FIX: 'py-24' hata kar 'pt-2 pb-16' kar diya.
    // 'pt-2' (8px) se upar ka gap "bohat tiny" ho jayega.
    <section className="pt-2 pb-16 relative overflow-hidden">
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Horizontal Card */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-gray-200/40"
        >
          
          {/* Subtle Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-10 md:px-12 md:py-12">
            
            {/* Left Side: Text */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50/50 px-3 py-1 text-xs font-medium text-purple-700 mx-auto lg:mx-0">
                 <Sparkles className="h-3.5 w-3.5 fill-purple-700/10" />
                 <span>Boost your productivity</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Ready to summarize your first document?
              </h2>
              
              <p className="text-base text-gray-600 max-w-xl mx-auto lg:mx-0">
                Join thousands of students and professionals using Docusense.
              </p>
            </div>

            {/* Right Side: Button */}
            <div className="shrink-0 flex flex-col items-center lg:items-end">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-sm font-semibold rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-purple-500/30 border-0"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-[10px] text-gray-400 mt-2 self-center">
                No credit card required
              </p>
            </div>

          </div>
        </MotionSection>
      </div>
    </section>
  );
}