import type { Metadata } from "next";
import { Archivo, Familjen_Grotesk, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Cursor from "@/components/ui/Cursor";
import MobileDock from "@/components/ui/MobileDock";

// Display: Archivo with the width axis, so headlines can run expanded.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const body = Familjen_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
      className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--ink)]">
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
        {/* Paper grain — one fixed layer, GPU-cheap */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] dark:opacity-[0.05]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <ThemeProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
            <MobileDock />
            <ScrollToTop />
            <WhatsAppButton />
            <Cursor />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
