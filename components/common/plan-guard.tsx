"use client"; // 👈 Ye Client Component hai

import { usePathname } from "next/navigation";
import UpgradeRequired from "@/components/common/upgrade-required";

export default function PlanGuard({
  hasActiveSubscription,
  children,
}: {
  hasActiveSubscription: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Agar user 'upgrade' page par hai, to roko mat (WHITELIST)
  if (pathname?.includes("/upgrade")) {
    return <>{children}</>;
  }

  // 2. Agar plan nahi hai, to Block screen dikhao
  if (!hasActiveSubscription) {
    return <UpgradeRequired />;
  }

  // 3. Agar sab theek hai, to content dikhao
  return <>{children}</>;
}