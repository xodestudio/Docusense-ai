import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      
      {/* Background Decor */}
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
                <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl mb-6 ring-4 ring-amber-500/5">
                    <Cookie className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Cookie Policy
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Transparency about the little data files we use.
                </p>
            </div>

            <div className="p-8 md:p-12 space-y-10">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center max-w-2xl mx-auto">
                    We use cookies to ensure Docusense.ai runs smoothly. We don't use them to spy on you, but to keep you logged in and make sure the site works fast.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    <CookieCard 
                        title="Essential Cookies" 
                        desc="Necessary for the website to function. For example, keeping you logged in via Clerk."
                    />
                    <CookieCard 
                        title="Performance Cookies" 
                        desc="Help us understand how the website performs and how users interact with it (Analytics)."
                    />
                    <CookieCard 
                        title="Functional Cookies" 
                        desc="Remember your choices, like your preferred language or region."
                    />
                    <CookieCard 
                        title="Third Party Cookies" 
                        desc="Used by our trusted partners like Stripe for payment processing security."
                    />
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I disable them?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Yes, you can disable cookies in your browser settings, but it may break key features of the site (like logging in).
                    </p>
                    <Button variant="outline" asChild>
                        <a href="https://www.allaboutcookies.org/" target="_blank" rel="noreferrer">Learn More About Cookies</a>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function CookieCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
    )
}