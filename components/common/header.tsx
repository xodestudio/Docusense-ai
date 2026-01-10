import { FileText, Crown } from "lucide-react"; // Crown import kya
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import PlanBadge from "./plan-badge";
import Link from "next/link"; // Link import zaroori hai

export default function Header() {
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-900">
            Summarie
          </span>
        </NavLink>
      </div>

      <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
        <NavLink href="/#pricing">Pricing</NavLink>

        <SignedIn>
          <NavLink href="/dashboard">Your Summaries</NavLink>
        </SignedIn>
      </div>

      <div className="flex lg:justify-end lg:flex-1">
        <SignedIn>
          <div className="flex gap-2 items-center">
            <NavLink href="/upload">Upload a PDF</NavLink>
            
            {/* 👇 LOGIC: Badge try karo. Agar plan hai to Badge dikhega. */}
            <div className="hidden lg:block">
                <PlanBadge />
            </div>

            {/* 👇 UI HACK: Agar Badge empty return hua (matlab PlanBadge ne null dia), 
                to humein pata nahi chalega client side pe.
                Is liye behtar hai hum "Upgrade" button ko 'PlanBadge' ke failure case par dikhayein.
                
                Lekin filhal simple rakhte hain: 
                Hum aik Button hardcode kar rahe hain jo sirf tab dikhega agar PlanBadge null ho? 
                Nahi, Server Components mein state share nahi hoti.
                
                Solution: PlanBadge ko hi kehne do ke wo kya dikhaye.
                Lekin agar aap chahte hain ke "Buy a plan" button dikhe jab plan na ho:
            */}
            
             {/* Note: Abhi PlanBadge sirf tab dikhega jab Active Plan hoga. 
                 Agar user FREE hai, to usay Upgrade Button dikhana chahiye. 
                 Hum yahan aik Link daal dete hain jo sirf visual hai. 
             */}
             <Link href="/dashboard/upgrade">
                <Button variant="ghost" size="sm" className="text-amber-600 font-bold hover:bg-amber-50 lg:hidden">
                    <Crown className="w-4 h-4" />
                </Button>
             </Link>

            <UserButton />
          </div>
        </SignedIn>

        <SignedOut>
          <NavLink href="/sign-in">Sign In</NavLink>
        </SignedOut>

      </div>
    </nav>
  );
}