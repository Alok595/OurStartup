"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Reveal, Spark } from "@/components/ui/motion";

type Capability = { id: string; tag: string; label: string; blurb: string; color: string; fg: string };

const CAPS: Capability[] = [
  { id: "web", tag: "websites", label: "Web Development", blurb: "Marketing sites, dashboards and web apps engineered for speed and SEO.", color: "#34D399", fg: "#0E0E10" },
  { id: "mobile", tag: "mobile applications", label: "Mobile Applications", blurb: "iOS and Android products with fluid UI and offline support.", color: "#60A5FA", fg: "#0E0E10" },
  { id: "ai", tag: "AI-powered solutions", label: "AI-Powered Solutions", blurb: "Copilots and retrieval pipelines that work quietly inside your product.", color: "#C4B5FD", fg: "#0E0E10" },
  { id: "automation", tag: "automation", label: "Automation", blurb: "Resilient pipelines that remove manual, repetitive work.", color: "#FF9A6B", fg: "#0E0E10" },
  { id: "branding", tag: "branding", label: "Branding", blurb: "Logo systems and design tokens that stay consistent everywhere.", color: "#FF8FB4", fg: "#0E0E10" },
  { id: "custom", tag: "custom software", label: "Custom Software", blurb: "Bespoke systems shaped around how your team actually works.", color: "#FFD23F", fg: "#0E0E10" },
];

const LEAD =
  "We are a technology-driven software agency helping startups, businesses, ambitious founders and forward-thinking enterprises build high-quality digital products.";

const AUDIENCE = [
  { label: "Startups", bg: "#FFD23F", rot: -4 },
  { label: "Businesses", bg: "#34D399", rot: 3 },
  { label: "Content creators", bg: "#FF8FB4", rot: -2 },
];

export default function IntroSection() {
  const [active, setActive] = useState<string | null>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: leadRef, offset: ["start 0.85", "end 0.5"] });
  const words = LEAD.split(" ");

  return (
    <section id="about" className="relative border-t-2 border-[var(--edge)] bg-[var(--bg)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="label flex items-center gap-2 text-[var(--sub)]">
                <span className="inline-block h-3 w-3 bg-[var(--accent)]" /> (01) Who we are
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-3 lg:flex-col lg:items-start">
              {AUDIENCE.map((a, i) => (
                <motion.span
                  key={a.label}
                  initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: a.rot }}
                  whileHover={{ rotate: 0, scale: 1.08 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 + i * 0.08 }}
                  className="label border-2 border-[#0E0E10] px-3 py-2 !text-[12px] text-[#0E0E10] shadow-[3px_3px_0_#0E0E10]"
                  style={{ backgroundColor: a.bg }}
                >
                  {a.label}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <p ref={leadRef} className="f-display-narrow text-[2.1rem] leading-[1.08] text-[var(--ink)] sm:text-5xl lg:text-[3.1rem]">
            {words.map((w, idx) => (
              <ScrubWord key={idx} progress={scrollYProgress} range={[idx / words.length, (idx + 1) / words.length]}>
                {w}
              </ScrubWord>
            ))}
          </p>

          <Reveal delay={0.1} className="mt-8 grid gap-8 border-t-2 border-[var(--edge)] pt-8 md:grid-cols-[auto_1fr]">
            <Spark size={44} color="var(--accent)" className="hidden md:block" />
            <p className="max-w-3xl text-xl leading-relaxed text-[var(--sub)] sm:text-2xl">
              Whether you need scalable enterprise systems, e-commerce platforms or sleek portfolio apps for content creators, we turn
              complex ideas into intuitive experiences that drive real growth. From{" "}
              <Tag cap={CAPS[0]} active={active} setActive={setActive} /> and <Tag cap={CAPS[1]} active={active} setActive={setActive} /> to{" "}
              <Tag cap={CAPS[2]} active={active} setActive={setActive} />, <Tag cap={CAPS[3]} active={active} setActive={setActive} />,{" "}
              <Tag cap={CAPS[4]} active={active} setActive={setActive} /> and <Tag cap={CAPS[5]} active={active} setActive={setActive} /> — we ship
              solutions that are scalable, secure and shaped around your business.
            </p>
          </Reveal>
          <p className="label mt-6 text-[var(--sub)] opacity-70 lg:hidden">Tap a highlighted word</p>
        </div>
      </div>
    </section>
  );
}

function ScrubWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

function Tag({
  cap,
  active,
  setActive,
}: {
  cap: Capability;
  active: string | null;
  setActive: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const open = active === cap.id;
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setActive(cap.id)}
        onMouseLeave={() => setActive((c) => (c === cap.id ? null : c))}
        onFocus={() => setActive(cap.id)}
        onBlur={() => setActive((c) => (c === cap.id ? null : c))}
        onClick={() => setActive(open ? null : cap.id)}
        className="group relative inline-block px-1 font-semibold"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-[0.08em] top-[0.18em] -rotate-1 transition-transform duration-200 group-hover:rotate-1"
          style={{ backgroundColor: cap.color }}
        />
        <span className="relative text-[#0E0E10]">{cap.tag}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 8, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 block w-60 -translate-x-1/2 border-2 border-[#0E0E10] p-3 text-left shadow-[4px_4px_0_#0E0E10]"
            style={{ backgroundColor: cap.color }}
          >
            <span className="label block !text-[10px] text-[#0E0E10]">{cap.label}</span>
            <span className="mt-1 block text-[14px] font-medium leading-snug text-[#0E0E10]">{cap.blurb}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
