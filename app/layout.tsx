import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ORIGIN_URL } from "@/utils/helpers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Outfit Configuration
const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

// 👇 SEO Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: "Docusense AI - Chat with your PDFs",
    template: "%s | Docusense AI", // Har page pe suffix lag jayega (e.g. "Pricing | Docusense AI")
  },
  description:
    "Transform lengthy PDFs into concise, actionable insights. Chat with documents and unlock knowledge with AI-powered analysis using Gemini 2.5 Flash.",
  
  // 1. Keywords for Google
  keywords: [
    "AI PDF Summarizer", 
    "Chat with PDF", 
    "Document Analysis AI", 
    "PDF to Text", 
    "Gemini AI Wrapper",
    "Student Research Tool",
    "Legal Document Summarizer"
  ],

  // 2. Authors & Creator
  authors: [{ name: "Docusense Team", url: ORIGIN_URL }],
  creator: "Docusense AI",

  // 3. Open Graph (Facebook, LinkedIn, Discord previews)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: ORIGIN_URL,
    title: "Docusense AI - Chat with your PDFs",
    description: "Upload PDFs and get instant AI summaries. Powered by Gemini 2.5 Flash.",
    siteName: "Docusense AI",
    images: [
      {
        url: "/opengraph-image.png", // Make sure ye image app folder mein ho
        width: 1200,
        height: 630,
        alt: "Docusense AI Preview",
      },
    ],
  },

  // 4. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Docusense AI - Chat with your PDFs",
    description: "Analyze documents instantly with AI.",
    images: ["/opengraph-image.png"],
    creator: "@docusense_ai", 
  },

  metadataBase: new URL(ORIGIN_URL),
  alternates: {
    canonical: "/",
  },

  verification: {
    google: "v3SF74ShBSQvlhK5ep00bOGkhlmFEAQoDAaA7SFCFmA",
  },

  // 5. Robots (Control crawling)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 6. Icons (With Cache Busting Trick)
  icons: {
    icon: "/icon.png?v=2",
    apple: "/icon.png?v=2",
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
        <body className={`${fontSans.variable} font-sans antialiased`}>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}