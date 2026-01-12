"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  
  return (
    <Link
      href={href}
      className={cn(
        // Base: Thora bold, smooth transition
        "text-sm font-medium transition-colors duration-200",
        // Default: Muted Grey jo hover par Primary (Indigo) ban jaye
        "text-muted-foreground hover:text-primary",
        // Active: Agar selected hai to Primary color + thora aur bold
        isActive && "text-primary font-semibold",
        className
      )}
    >
      {children}
    </Link>
  );
}