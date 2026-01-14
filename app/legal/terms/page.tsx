import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container max-w-4xl mx-auto py-12 px-4 relative z-10">
        
        <div className="mb-8">
            <Button asChild variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            
            <div className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl mb-6 ring-4 ring-blue-500/5">
                    <FileText className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Terms of Service
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                   Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="p-8 md:p-12 space-y-10">
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-6 bg-blue-50 dark:bg-blue-900/10 py-4 rounded-r-lg">
                    By using Docusense.ai, you agree to these terms. Please read them carefully. They essentially say: "We provide the tool, you own your data, and please don't misuse the platform."
                </p>

                <div className="space-y-8">
                    <Section title="1. Acceptance of Terms">
                        <p className="text-gray-600 dark:text-gray-400">
                            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                        </p>
                    </Section>

                    <Section title="2. Subscriptions & Payments">
                        <ul className="grid gap-3 mt-4">
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span><strong>Free Plan:</strong> Limited access to features (10MB limit).</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                <span><strong>Pro Plan:</strong> Paid subscription via Stripe. You can cancel anytime from your dashboard.</span>
                            </li>
                        </ul>
                    </Section>

                    <Section title="3. User Content & Conduct">
                        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl p-5 mt-2">
                             <h4 className="flex items-center gap-2 font-semibold text-orange-700 dark:text-orange-400 mb-2">
                                <AlertTriangle className="w-4 h-4" /> Important
                             </h4>
                             <p className="text-sm text-orange-800 dark:text-orange-300">
                                You are responsible for the content of the PDFs you upload. Do not upload illegal, offensive, or malicious content. We reserve the right to ban users who violate this policy.
                             </p>
                        </div>
                    </Section>

                    <Section title="4. Termination">
                        <p className="text-gray-600 dark:text-gray-400">
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </Section>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
            {children}
        </section>
    );
}