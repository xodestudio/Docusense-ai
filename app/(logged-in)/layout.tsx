import { hasActivePlan } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PlanGuard from "@/components/common/plan-guard"; // 👈 Naya component import karo

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Database se check karo plan hai ya nahi
  const hasActiveSubscription = await hasActivePlan(user.emailAddresses[0].emailAddress);

  // ❌ PURANA BLOCKING CODE HATA DO:
  // if(!hasActiveSubscription){
  //   return <UpgradeRequired/>
  // }

  // ✅ NAYA LOGIC: PlanGuard ko zimmedari de do
  return (
    <PlanGuard hasActiveSubscription={hasActiveSubscription}>
      {children}
    </PlanGuard>
  );
}