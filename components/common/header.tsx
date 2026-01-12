import { Sparkles, Crown } from "lucide-react"; 
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import PlanBadge from "./plan-badge";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        
        {/* --- LEFT: LOGO --- */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
            {/* Premium Icon Container */}
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                <Sparkles className="w-5 h-5 text-primary" />
            </div>
            {/* Modern Typography */}
            <span className="font-bold text-xl tracking-tight text-foreground">
              Docusense<span className="text-primary">.ai</span>
            </span>
          </Link>
        </div>

        {/* --- CENTER: LINKS (Logic Preserved) --- */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <NavLink href="/#pricing" className="hover:text-primary transition-colors">Pricing</NavLink>

          <SignedIn>
            <NavLink href="/dashboard" className="hover:text-primary transition-colors">Your Summaries</NavLink>
          </SignedIn>
        </div>

        {/* --- RIGHT: AUTH & ACTIONS --- */}
        <div className="flex items-center justify-end gap-3 lg:gap-4 lg:flex-1">
          <SignedIn>
            <div className="flex gap-3 items-center">
              <NavLink href="/upload" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">
                Upload a PDF
              </NavLink>
              
              {/* 👇 LOGIC: Badge logic maintained */}
              <div className="hidden lg:block">
                  <PlanBadge />
              </div>

              {/* 👇 LOGIC: Mobile Upgrade Button maintained (Styled Better) */}
               <Link href="/dashboard/upgrade" className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary rounded-full">
                      <Crown className="w-4 h-4" />
                  </Button>
               </Link>

              {/* User Button with Ring for Polish */}
              <div className="ring-2 ring-primary/10 rounded-full p-0.5 ml-1">
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8"
                        }
                    }}
                />
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            {/* Premium Sign In Button */}
            <SignInButton mode="modal">
                <Button className="rounded-full px-6 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    Sign In
                </Button>
            </SignInButton>
          </SignedOut>

        </div>
      </nav>
    </header>
  );
}