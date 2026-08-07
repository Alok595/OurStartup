"use client";

import { motion } from "framer-motion";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const SOCIALS = [
  {
    name: "Instagram",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    link: "#",
  },
  {
    name: "Gmail",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    ),
    link: "mailto:hello@startupour.com",
  },
  {
    name: "WhatsApp",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    link: "#",
  },
  {
    name: "LinkedIn",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    link: "#",
  },
];

export default function SocialMarquee() {
  // Duplicate array to create a seamless infinite loop
  const duplicateSocials = [...SOCIALS, ...SOCIALS, ...SOCIALS, ...SOCIALS, ...SOCIALS, ...SOCIALS];

  return (
    <section className={`${display.variable} ${body.variable} ${mono.variable} border-b border-[var(--line)] bg-[var(--bg)] py-12 overflow-hidden`}>
      <div className="flex flex-col items-center gap-8">
        
        <h3 
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]" 
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Connect with us
        </h3>

        <div className="relative w-full flex overflow-hidden group">
          {/* Fading Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-40" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-40" />
          
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
            className="flex w-max items-center gap-12 sm:gap-24 px-6"
          >
            {duplicateSocials.map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                className="flex items-center gap-3 text-[var(--ink)] opacity-70 transition-all hover:opacity-100 hover:text-[var(--accent)]"
              >
                {social.icon}
                <span className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {social.name}
                </span>
              </a>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
