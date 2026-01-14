import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Server } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative selection:bg-primary/20">
      
      {/* 1. Background Pattern (Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="container max-w-4xl mx-auto py-12 px-4 relative z-10">
        
        {/* Navigation */}
        <div className="mb-8">
            <Button asChild variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all group">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
            </Button>
        </div>

        {/* Main Document Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6 ring-4 ring-primary/5">
                    <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Privacy Policy
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-12 space-y-12">
                
                {/* Intro */}
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                        Your privacy is not just a legal requirement for us; it's a core feature of <strong>Docusense.ai</strong>. This policy outlines exactly what happens with your data when you use our AI summarization tools.
                    </p>
                </div>

                {/* Info Blocks */}
                <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard 
                        icon={<Eye className="w-5 h-5" />} 
                        title="What We Collect" 
                        desc="We collect your uploaded PDFs solely for processing and your email for account access."
                    />
                    <InfoCard 
                        icon={<Server className="w-5 h-5" />} 
                        title="How We Store It" 
                        desc="Files are processed in secure, ephemeral environments and are not shared with advertisers."
                    />
                </div>

                {/* Detailed Sections */}
                <div className="space-y-8">
                    <Section title="1. Information Collection">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We collect information to provide better services to all our users. This includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400 mt-2">
                            <li><strong>Personal Info:</strong> Name and Email address (via Clerk Authentication).</li>
                            <li><strong>Files:</strong> PDF documents you actively upload.</li>
                            <li><strong>Usage Data:</strong> Pages visited and features used (for analytics).</li>
                        </ul>
                    </Section>

                    <Section title="2. AI Processing & Privacy">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We use advanced LLMs (Large Language Models) to summarize your documents. 
                            <span className="block mt-2 p-4 bg-primary/5 rounded-lg border border-primary/10 text-primary font-medium">
                                <Lock className="w-4 h-4 inline mr-2 mb-0.5" />
                                Your documents are NOT used to train our public AI models.
                            </span>
                        </p>
                    </Section>

                    <Section title="3. Third-Party Sharing">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We do not sell your personal data. We only share data with trusted infrastructure providers (like AWS, Vercel, Stripe) necessary to run the service.
                        </p>
                    </Section>
                </div>

            </div>
            
            {/* Footer of Card */}
            <div className="bg-gray-50 dark:bg-gray-950/50 p-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500">
                Questions about your data? Contact us at <a href="mailto:privacy@docusense.ai" className="text-primary hover:underline">privacy@docusense.ai</a>
            </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components for Cleaner Code
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full inline-block" />
                {title}
            </h2>
            {children}
        </section>
    );
}

function InfoCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-2 text-primary font-semibold">
                {icon} {title}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}