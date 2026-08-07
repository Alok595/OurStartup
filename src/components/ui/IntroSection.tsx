"use client";

/**
 * IntroSection.tsx
 * ----------------------------------------------------------------------------
 * "About" section, two-column on larger screens:
 *   left  — eyebrow, the agency's exact description copy (six service
 *           phrases tagged inline, same interaction as before: scroll-drawn
 *           underline + hover/focus/tap tooltip), startup emphasis
 *   right — an animated line-art "workstation" scene: desk, monitor, CPU
 *           tower, a seated person typing, floating UI chips, a coffee cup
 *           with steam — drawn in the same stroke language as HeroSection's
 *           SVGs (pathLength draw-in, then small infinite idle loops).
 * Below both: the six-item capability ledger, unchanged in spirit.
 *
 * On mobile the illustration moves to the top (its own card, full width) so
 * it's never squeezed or hidden — text and ledger follow below it.
 *
 * Requires the same CSS custom properties as HeroSection to be available on
 * this section: --bg, --ink, --sub, --line, --accent.
 * ----------------------------------------------------------------------------
 */

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Six disciplines — same ids/order/accents as HeroSection's `services`, and
// tag text matches the exact wording used in the paragraph below so the
// highlighted words line up 1:1 with the sentence.
// ---------------------------------------------------------------------------
type Capability = {
  id: string;
  tag: string;
  label: string;
  blurb: string;
  accentLight: string;
  accentDark: string;
};

const CAPABILITIES: Capability[] = [
  { id: "web", tag: "websites", label: "Web Development", blurb: "Marketing sites, dashboards and web apps engineered for speed and SEO.", accentLight: "#D9600A", accentDark: "#FF8A3D" },
  { id: "mobile", tag: "mobile applications", label: "Mobile Applications", blurb: "iOS and Android products with fluid UI and offline support.", accentLight: "#5B45CF", accentDark: "#9C8CFF" },
  { id: "ai", tag: "AI-powered solutions", label: "AI-Powered Solutions", blurb: "Copilots and retrieval pipelines that work quietly inside your product.", accentLight: "#0C9C89", accentDark: "#4FE8D0" },
  { id: "automation", tag: "automation", label: "Automation", blurb: "Resilient pipelines that remove manual, repetitive work.", accentLight: "#0C9C89", accentDark: "#4FE8D0" },
  { id: "branding", tag: "branding", label: "Branding", blurb: "Logo systems and design tokens that stay consistent everywhere.", accentLight: "#5B45CF", accentDark: "#9C8CFF" },
  { id: "custom", tag: "custom software", label: "Custom Software", blurb: "Bespoke systems shaped around how your team actually works.", accentLight: "#D9600A", accentDark: "#FF8A3D" },
];

export default function IntroSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="about"
      className={`${display.variable} ${body.variable} ${mono.variable} relative flex min-h-[100vh] flex-col justify-center overflow-hidden border-b border-[var(--line)] bg-[var(--bg)] px-6 py-24 sm:px-10 sm:py-28 lg:py-32`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* faint grid texture — same language as the hero, kept very quiet */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="flex flex-col items-center gap-12">
          {/* ---------------------------------------------------------- */}
          {/* COPY */}
          {/* ---------------------------------------------------------- */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-8"
            >
              <div className="flex flex-col items-center gap-4">
                <h2 
                  className="text-5xl font-bold tracking-tight text-[var(--ink)] sm:text-6xl lg:text-[4.5rem]" 
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Who we are.
                </h2>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span
                    className="inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Startups
                  </span>
                  <span
                    className="inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Businesses
                  </span>
                  <span
                    className="inline-flex items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Content Creators
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="text-2xl leading-[1.55] tracking-tight text-[var(--ink)] sm:text-3xl lg:text-[2.2rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We are a technology-driven software development agency helping startups, businesses, ambitious founders, and forward-thinking enterprises build high-quality digital products. 
              Whether you need scalable enterprise systems, e-commerce platforms, or sleek portfolio apps for content creators, our core focus is transforming complex ideas into intuitive, user-centric experiences that drive real growth.
              From <TaggedWord cap={CAPABILITIES[0]} index={0} active={active} setActive={setActive} /> and{" "}
              <TaggedWord cap={CAPABILITIES[1]} index={1} active={active} setActive={setActive} /> to{" "}
              <TaggedWord cap={CAPABILITIES[2]} index={2} active={active} setActive={setActive} />,{" "}
              <TaggedWord cap={CAPABILITIES[3]} index={3} active={active} setActive={setActive} />,{" "}
              <TaggedWord cap={CAPABILITIES[4]} index={4} active={active} setActive={setActive} />, and{" "}
              <TaggedWord cap={CAPABILITIES[5]} index={5} active={active} setActive={setActive} />, we deliver
              scalable, secure, and innovative solutions tailored to your exact business needs.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-4 text-[12px] uppercase tracking-[0.16em] text-[var(--sub)]/70 lg:hidden"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Tap a highlighted word to learn more
            </motion.p>
          </div>
        </div>

      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TAGGED WORD — accent-colored inline phrase with a scroll-drawn underline;
// hover, focus, or tap reveals a small tooltip card with a one-liner.
// ---------------------------------------------------------------------------
function TaggedWord({
  cap,
  index,
  active,
  setActive,
}: {
  cap: Capability;
  index: number;
  active: string | null;
  setActive: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const isOpen = active === cap.id;

  return (
    <span
      className="relative inline-block [--cap-color:var(--cap-light)] dark:[--cap-color:var(--cap-dark)]"
      style={{ "--cap-light": cap.accentLight, "--cap-dark": cap.accentDark } as React.CSSProperties}
    >
      <button
        type="button"
        onMouseEnter={() => setActive(cap.id)}
        onMouseLeave={() => setActive((cur) => (cur === cap.id ? null : cur))}
        onFocus={() => setActive(cap.id)}
        onBlur={() => setActive((cur) => (cur === cap.id ? null : cur))}
        onClick={() => setActive(isOpen ? null : cap.id)}
        className="relative -mx-0.5 inline-block rounded-sm border-0 bg-transparent px-0.5 py-0 align-baseline font-semibold text-[var(--cap-color)] outline-none transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cap-color)]"
      >
        {cap.tag}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.12, ease: EASE }}
          className="absolute -bottom-0.5 left-0.5 right-0.5 h-[2.5px] origin-left rounded-full"
          style={{ backgroundColor: "var(--cap-color)" }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-48 -translate-x-1/2 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 text-left shadow-lg sm:w-56 block"
          >
            <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--cap-color)]" style={{ fontFamily: "var(--font-mono)" }}>
              {cap.label}
            </span>
            <span className="mt-1 block text-[12.5px] font-normal leading-snug tracking-normal text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
              {cap.blurb}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// MINI ICON — tiny line-drawn glyphs for the ledger (unchanged concept).
// ---------------------------------------------------------------------------
function MiniIcon({ id }: { id: string }) {
  const stroke = "var(--cap-color)";
  const shape = { fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const draw = (delay = 0) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  switch (id) {
    case "web":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7 overflow-visible">
          <motion.rect x="4" y="6" width="24" height="20" rx="3" {...shape} {...draw(0)} />
          <motion.line x1="4" y1="13" x2="28" y2="13" {...shape} {...draw(0.4)} />
          <circle cx="8" cy="9.5" r="0.9" fill={stroke} />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7 overflow-visible">
          <motion.rect x="9" y="3" width="14" height="26" rx="4" {...shape} {...draw(0)} />
          <motion.line x1="13" y1="24.5" x2="19" y2="24.5" {...shape} {...draw(0.5)} />
        </svg>
      );
    case "ai":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7 overflow-visible">
          <motion.line x1="8" y1="10" x2="16" y2="16" {...shape} {...draw(0)} />
          <motion.line x1="24" y1="10" x2="16" y2="16" {...shape} {...draw(0.1)} />
          <motion.line x1="8" y1="22" x2="16" y2="16" {...shape} {...draw(0.2)} />
          <motion.line x1="24" y1="22" x2="16" y2="16" {...shape} {...draw(0.3)} />
          <circle cx="8" cy="10" r="2" fill={stroke} />
          <circle cx="24" cy="10" r="2" fill={stroke} />
          <circle cx="8" cy="22" r="2" fill={stroke} />
          <circle cx="24" cy="22" r="2" fill={stroke} />
          <circle cx="16" cy="16" r="2.6" fill={stroke} />
        </svg>
      );
    case "automation":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7 overflow-visible">
          <motion.circle cx="16" cy="16" r="8" {...shape} {...draw(0)} />
          <motion.circle cx="16" cy="16" r="2.6" {...shape} {...draw(0.4)} />
          {[0, 90, 180, 270].map((deg, i) => {
            const x1 = 16 + 8 * Math.cos((deg * Math.PI) / 180);
            const y1 = 16 + 8 * Math.sin((deg * Math.PI) / 180);
            const x2 = 16 + 12 * Math.cos((deg * Math.PI) / 180);
            const y2 = 16 + 12 * Math.sin((deg * Math.PI) / 180);
            return <motion.line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} {...shape} strokeWidth={2.2} {...draw(0.15 + i * 0.05)} />;
          })}
        </svg>
      );
    case "branding":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7 overflow-visible">
          <motion.circle cx="13" cy="16" r="8" {...shape} {...draw(0)} />
          <motion.circle cx="19" cy="16" r="8" {...shape} {...draw(0.25)} />
        </svg>
      );
    case "custom":
      return (
        <svg viewBox="0 0 32 32" className="h-7 w-7 overflow-visible">
          <motion.path d="M12 8 L4 16 L12 24" {...shape} {...draw(0)} />
          <motion.path d="M20 8 L28 16 L20 24" {...shape} {...draw(0.2)} />
        </svg>
      );
    default:
      return null;
  }
}