import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genzdevworks.ratnahomes.in"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "2yil0IV_DcsLoOnVDG3_JIt3Z5uRdPc-WxOCW1wMVek",
  },
  title: {
    default: "GenZDevWorks | Premium Software Agency",
    template: "%s | GenZDevWorks Agency",
  },
  description: "A technology-driven software development agency helping startups and enterprises build high-quality digital products, AI solutions, and mobile apps.",
  keywords: ["software agency", "web development", "mobile apps", "AI solutions", "UI/UX design", "startup scaling"],
  authors: [{ name: "GenZDevWorks" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://genzdevworks.ratnahomes.in",
    title: "GenZDevWorks | Premium Software Agency",
    description: "Building scalable, secure, and innovative digital solutions tailored to business needs.",
    siteName: "GenZDevWorks",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenZDevWorks | Premium Software Agency",
    description: "Technology-driven software development agency helping startups and enterprises.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col mac-bg text-black dark:text-white transition-colors duration-500">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "GenZDevWorks",
              "url": "https://genzdevworks.ratnahomes.in/",
              "logo": "https://genzdevworks.ratnahomes.in/icon.png",
              "description": "A technology-driven software development agency helping startups and enterprises build high-quality digital products, AI solutions, and mobile apps.",
            })
          }}
        />
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.12] dark:opacity-[0.06] mix-blend-multiply dark:mix-blend-screen"
          style={{ backgroundImage: 'radial-gradient(var(--ink) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        ></div>
        
        {/* Noise Texture Overlay */}
        <div 
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04] dark:opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
        <ThemeProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
            <WhatsAppButton />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
