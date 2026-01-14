"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/actions/newsletter";

export default function Footer() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Server Action Call
    const result = await subscribeToNewsletter(null, formData);

    if (result.success) {
      toast.success("Subscribed!", { description: result.message });
      (e.target as HTMLFormElement).reset(); // Form clear kro
    } else {
      toast.error("Error", { description: result.message });
    }

    setIsLoading(false);
  };

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900/50 border-t border-border/50 overflow-hidden pt-12 pb-8">
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary text-white shadow-lg shadow-primary/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Docusense.ai
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mt-4">
              Unlock the power of your documents. AI-driven summaries, instant insights, and secure storage for everyone.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<Github className="h-4 w-4" />} href="https://github.com/xodestudio/Docusense-ai" />
              <SocialIcon icon={<Twitter className="h-4 w-4" />} href="https://x.com/xodestudio" />
              <SocialIcon icon={<Linkedin className="h-4 w-4" />} href="https://www.linkedin.com/in/xodestudio" />
            </div>
          </div>

          {/* 2. Links Section */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Platform</h3>
              <ul className="space-y-3">
                <FooterLink href="/dashboard" text="Dashboard" />
                <FooterLink href="/upload" text="Upload PDF" />
                <FooterLink href="/#pricing" text="Pricing" />
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
              <ul className="space-y-3">
                {/* 👇 Links updated to point to real pages */}
                <FooterLink href="/legal/privacy" text="Privacy Policy" />
                <FooterLink href="/legal/terms" text="Terms of Service" />
                <FooterLink href="/legal/cookies" text="Cookie Policy" />
              </ul>
            </div>
          </div>

          {/* 3. Newsletter Section (Updated Functionality) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest updates and AI features.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="email"
                  type="email" 
                  placeholder="Enter your email" 
                  className="pl-9 bg-background border-border/60 focus-visible:ring-primary/20" 
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading}
                className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Docusense AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
                Made with <span className="text-red-500">♥</span> in Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href} 
      className="h-8 w-8 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors block">
        {text}
      </Link>
    </li>
  );
}