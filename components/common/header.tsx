import { Sparkles, Crown, UploadCloud } from "lucide-react"; 
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import PlanBadge from "./plan-badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    // 🚀 1. Next-Level Glass Effect
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-black/60 backdrop-blur-xl transition-all supports-[backdrop-filter]:bg-white/60">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        
        {/* --- LEFT: LOGO --- */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
            {/* Premium Icon Container with Glow */}
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
               <Sparkles className="w-5 h-5 text-primary relative z-10" />
            </div>
            {/* Modern Typography */}
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              Docusense<span className="text-primary">.ai</span>
            </span>
          </Link>
        </div>

        {/* --- CENTER: LINKS --- */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <NavLink href="/#pricing" className="hover:text-primary transition-colors">Pricing</NavLink>

          <SignedIn>
            <NavLink href="/dashboard" className="hover:text-primary transition-colors">Your Summaries</NavLink>
          </SignedIn>
        </div>

        {/* --- RIGHT: AUTH & ACTIONS --- */}
        <div className="flex items-center justify-end gap-3 lg:gap-4 lg:flex-1">
          <SignedIn>
            <div className="flex gap-3 items-center">
              
              {/* Upload Button (Subtle) */}
              <Link href="/upload" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800">
                <UploadCloud className="w-4 h-4" />
                Upload PDF
              </Link>
              
              {/* Plan Badge */}
              <div className="hidden lg:block">
                  <PlanBadge />
              </div>

              {/* Mobile Upgrade Icon */}
               <Link href="/dashboard/upgrade" className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary rounded-full">
                      <Crown className="w-4 h-4" />
                  </Button>
               </Link>

              {/* 🔴 2. PROFILE FIX: Perfect Circle Container */}
              {/* Clerk UserButton ko aik styled div mein wrap kiya hai */}
              <div className="flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm ring-2 ring-gray-100 dark:ring-gray-800 overflow-hidden ml-1">
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-full w-full", // Image container ko full width/height
                            userButtonTrigger: "h-full w-full focus:shadow-none", // Trigger ko fix kiya
                        }
                    }}
                />
              </div>

            </div>
          </SignedIn>

          <SignedOut>
            {/* Premium Sign In Button */}
            <SignInButton mode="modal">
                <Button className="rounded-full px-6 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-primary to-purple-600 border-0">
                    Sign In
                </Button>
            </SignInButton>
          </SignedOut>

        </div>
      </nav>
    </header>
  );
}