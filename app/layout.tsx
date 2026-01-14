import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ORIGIN_URL } from "@/utils/helpers";
import { Analytics } from "@vercel/analytics/next";

// 👇 Change 2: Outfit Configuration
const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

// 👇 Change 3: Updated Branding for Docusense
export const metadata: Metadata = {
  title: "Docusense AI - Chat with your PDFs",
  description:
    "Transform lengthy PDFs into concise, actionable insights. Chat with documents and unlock knowledge with AI-powered analysis.",
  icons: {
    icon: "/favicon.ico",
  },

  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* 👇 Font variable inject ho raha hai */}
        <body className={`${fontSans.variable} font-sans antialiased`}>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}