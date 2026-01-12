import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import { hasReachedUploadLimit } from "@/lib/user";
import { containerVariants } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const maxDuration = 300; 

export default async function UploadPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const userId = user.id;
  const { hasReachedLimit } = await hasReachedUploadLimit(userId);

  if (hasReachedLimit) {
    redirect("/dashboard");
  }

  return (
    // 👇 FIX: 'justify-center' hata diya. 'pt-24' (approx 6rem/96px) add kiya taake content upar shift ho.
    <section className="relative isolate min-h-screen flex flex-col overflow-hidden bg-background">
      
      {/* Background Ambience */}
      <BgGradient className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]" />

      {/* Main Container */}
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // 'mt-8' add kiya taake header thora saans le, lekin zyada neeche na jaye
        className="w-full max-w-4xl mx-auto px-6 lg:px-8 relative z-10"
      >
        <div className="flex flex-col items-center gap-10 text-center"> {/* gap-12 -> gap-10 */}
          
          <UploadHeader />
          
          <div className="w-full max-w-2xl">
            <UploadForm />
          </div>
          
        </div>
      </MotionDiv>
    </section>
  );
}