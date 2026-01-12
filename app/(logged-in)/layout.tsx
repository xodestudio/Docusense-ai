import { hasActivePlan } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PlanGuard from "@/components/common/plan-guard"; 

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const hasActiveSubscription = await hasActivePlan(user.emailAddresses[0].emailAddress);

  return (
    <PlanGuard hasActiveSubscription={hasActiveSubscription}>
      {children}
    </PlanGuard>
  );
}