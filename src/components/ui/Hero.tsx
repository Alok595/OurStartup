"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { Arrow, EASE, Magnetic, Marquee, Spark, SplitWords } from "@/components/ui/motion";
import HeroArt from "@/components/ui/HeroArt";

type Slide = {
  word: string;
  tag: string;
  line: string;
  bg: string;
  fg: string;
};

const SLIDES: Slide[] = [
  {
    word: "websites",
    tag: "Web Development",
    line: "Marketing sites, dashboards and web apps engineered for speed, SEO and clean handoffs — from first pixel to production.",
    bg: "#059669",
    fg: "#FFFFFF",
  },
  {
    word: "apps",
    tag: "Mobile Applications",
    line: "iOS and Android products with fluid UI, offline support and analytics baked in from day one — not bolted on after launch.",
    bg: "#1E40AF",
    fg: "#FFFFFF",
  },
  {
    word: "AI tools",
    tag: "AI-Powered Solutions",
    line: "Copilots, retrieval pipelines and model integrations designed around real workflows, with guardrails your team can trust.",
    bg: "#7C3AED",
    fg: "#FFFFFF",
  },
  {
    word: "robots",
    tag: "Automation",
    line: "We map your busywork and replace it with resilient pipelines — internal tools, integrations and workflows that just run.",
    bg: "#FF5A1F",
    fg: "#0E0E10",
  },
  {
    word: "brands",
    tag: "Branding",
    line: "Logo systems, design tokens and brand guidelines that stay consistent from the pitch deck to the product itself.",
    bg: "#FF3D7F",
    fg: "#0E0E10",
  },
  {
    word: "software",
    tag: "Custom Software",
    line: "When off-the-shelf stops fitting, we design and build bespoke systems that scale with your team, not against it.",
    bg: "#FFD23F",
    fg: "#0E0E10",
  },
];

const TICKER = ["Web Development", "Mobile Apps", "AI Solutions", "Automation", "Branding", "Custom Software", "SEO", "UI / UX"];

const DURATION = 3200;

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const slide = SLIDES[i];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused]);

  // pointer parallax (desktop only — touch never fires mouse pointermove)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const sparkX = useTransform(sx, (v) => v * -30);
  const sparkY = useTransform(sy, (v) => v * -30);
  const artX = useTransform(sx, (v) => v * 14);
  const artY = useTransform(sy, (v) => v * 14);

  return (
    <section
      ref={sectionRef}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative flex flex-col overflow-hidden sm:min-h-[min(100svh,880px)] bg-[var(--bg)] pt-24 sm:pt-28"
    >
      <div aria-hidden className="ruled pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_30%_40%,#000_20%,transparent_75%)]" />

      {/* Stickers — drag them around, they're just for fun */}
      <Sticker drag={sectionRef} x={sx} y={sy} depth={40} className="right-[1.5%] top-[60%] hidden rotate-[6deg] lg:block" bg="#FFD23F">
        <span className="label !text-[11px] text-[#0E0E10]">100% hand-coded</span>
      </Sticker>
      <Sticker drag={sectionRef} x={sx} y={sy} depth={-55} className="right-[25%] top-[14%] hidden -rotate-[6deg] xl:block" bg="#34D399">
        <span className="label !text-[11px] text-[#0E0E10]">IIT engineers</span>
      </Sticker>
      <Sticker drag={sectionRef} x={sx} y={sy} depth={70} className="right-[23%] top-[60%] hidden rotate-[-4deg] lg:block" bg="#0E0E10">
        <span className="flex items-center gap-2">
          <Spark size={14} color="#FFD23F" />
          <span className="label !text-[11px] text-[#F3EFE6]">reply &lt; 24h</span>
        </span>
      </Sticker>
      <motion.div
        aria-hidden
        style={{ x: sparkX, y: sparkY }}
        className="pointer-events-none absolute right-[2.5%] top-[13%] z-20 hidden lg:block"
      >
        <Spark size={58} color="var(--bubblegum)" className="spin-slow" />
      </motion.div>

      {/* Poster that swaps its drawing with the rotating word */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
        animate={{ opacity: 1, scale: 1, rotate: 2 }}
        transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
        style={{ x: artX, y: artY }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="absolute right-[5%] top-[19%] z-[15] hidden w-[min(27vw,380px,46svh)] lg:block"
      >
        <HeroArt index={i} bg={slide.bg} fg={slide.fg} tag={slide.tag} />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <span className="flex items-center gap-2 border-2 border-[var(--edge)] bg-[var(--paper)] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping bg-[var(--emerald)] opacity-70" />
              <span className="relative h-2 w-2 bg-[var(--emerald)]" />
            </span>
            <span className="label text-[var(--ink)]">Booking new projects</span>
          </span>
          <span className="label text-[var(--sub)]">Software studio — India → everywhere</span>
        </motion.div>

        <h1 className="f-display text-[13vw] text-[var(--ink)] sm:text-[11vw] lg:text-[8.6vw] 2xl:text-[124px]">
          <SplitWords text="We build" onMount delay={0.1} />
          <span className="mt-[0.06em] block">
            <span
              className="relative inline-flex h-[1.02em] items-center overflow-hidden border-[3px] border-[var(--edge)] px-[0.14em] align-bottom shadow-[6px_6px_0_var(--shadow)] transition-colors duration-500"
              style={{ backgroundColor: slide.bg, color: slide.fg }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={slide.word}
                  initial={{ y: "105%", rotate: 4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  exit={{ y: "-105%", rotate: -4 }}
                  transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
                  className="inline-block whitespace-nowrap pb-[0.06em]"
                >
                  {slide.word}
                </motion.span>
              </AnimatePresence>
              {/* progress rule */}
              <motion.span
                key={`bar-${i}-${paused}`}
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0.2 : DURATION / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[5px] w-full origin-left"
                style={{ backgroundColor: slide.fg, opacity: 0.55 }}
              />
            </span>
          </span>
          <span className="block">
            <SplitWords text="that" onMount delay={0.3} />{" "}
            <motion.span
              initial={{ opacity: 0, rotate: -8, scale: 0.6 }}
              animate={{ opacity: 1, rotate: -4, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 260, damping: 14 }}
              className="f-serif inline-block text-[1.12em] text-[var(--accent)]"
            >
              pop.
            </motion.span>
          </span>
        </h1>

        <div className="mt-8 grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.word}
                  onClick={() => setI(idx)}
                  aria-label={`Show ${s.tag}`}
                  className="h-3 border-2 border-[var(--edge)] transition-all duration-300"
                  style={{ width: idx === i ? 36 : 12, backgroundColor: idx === i ? s.bg : "transparent" }}
                />
              ))}
              <span className="label ml-2 text-[var(--sub)]">
                {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")} — {slide.tag}
              </span>
            </div>
            <div className="relative mt-4 min-h-[5.5rem] sm:min-h-[4.5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={slide.tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-xl text-lg leading-snug text-[var(--sub)] sm:text-xl"
                >
                  {slide.line}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            className="flex flex-wrap gap-4 lg:col-span-6 lg:justify-end"
          >
            <Magnetic>
              <Link href="/contact" prefetch className="btn btn-yolk !px-7 !py-5">
                Start a project <Arrow size={15} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/projects" className="btn btn-paper !px-7 !py-5">
                See the work
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Tilted ticker */}
      <div className="relative z-10 mt-10 -mx-4 mb-8 -rotate-[2deg] border-y-[3px] border-[var(--edge)] bg-[var(--yolk)] py-3 text-[#0E0E10] sm:mt-14">
        <Marquee speed={32}>
          {TICKER.map((t) => (
            <span key={t} className="flex items-center gap-6 pr-6">
              <span className="f-display-narrow whitespace-nowrap text-2xl uppercase sm:text-3xl">{t}</span>
              <Spark size={20} color="#0E0E10" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function Sticker({
  children,
  className,
  bg,
  x,
  y,
  depth,
  drag,
}: {
  children: React.ReactNode;
  className?: string;
  bg: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  drag: React.RefObject<HTMLElement | null>;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: tx, y: ty }} className={`absolute z-20 ${className}`}>
      <motion.div
        drag
        dragConstraints={drag}
        dragElastic={0.2}
        whileHover={{ scale: 1.06 }}
        whileDrag={{ scale: 1.12, rotate: 0, cursor: "grabbing" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.8 }}
        className="cursor-grab border-2 border-[#0E0E10] px-4 py-3 shadow-[4px_4px_0_#0E0E10]"
        style={{ backgroundColor: bg }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
