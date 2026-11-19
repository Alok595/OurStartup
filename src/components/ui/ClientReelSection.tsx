"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { EASE, Reveal, SplitWords } from "@/components/ui/motion";

const REELS = [
  { id: 1, handle: "alexrivera", name: "Alex Rivera", company: "Founder, SyncFlow", likes: "12.4K", comments: "342", panel: "panel-emerald" },
  { id: 2, handle: "sarahjenkins", name: "Sarah Jenkins", company: "CTO, TechFlow Inc.", likes: "8.9K", comments: "156", panel: "panel-cobalt" },
  { id: 3, handle: "marcuschen", name: "Marcus Chen", company: "CEO, Innovate", likes: "15.2K", comments: "892", panel: "panel-flame" },
  { id: 4, handle: "elenarostova", name: "Elena Rostova", company: "Director, Global Reach", likes: "22.1K", comments: "1.2K", panel: "panel-grape" },
  { id: 5, handle: "davidkim", name: "David Kim", company: "VP Product, NextGen", likes: "5.4K", comments: "94", panel: "panel-emerald" },
];

export default function ClientReelSection() {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <section className="relative overflow-hidden border-t-2 border-[var(--edge)] bg-[var(--paper)] py-14 sm:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 sm:flex-row sm:items-end sm:px-8">
        <div>
          <Reveal>
            <p className="label flex items-center gap-2 text-[var(--sub)]">
              <span className="inline-block h-3 w-3 bg-[var(--flame)]" /> (06) On the reel
            </p>
          </Reveal>
          <h2 className="f-display mt-6 text-[11vw] text-[var(--ink)] sm:text-7xl lg:text-[5.5rem]">
            <SplitWords text="Hear it" /> <span className="f-serif text-[var(--accent)]"><SplitWords text="from them." delay={0.12} /></span>
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="grid h-14 w-14 place-items-center border-2 border-[var(--edge)] text-xl text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]">
            ←
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="grid h-14 w-14 place-items-center border-2 border-[var(--edge)] bg-[var(--yolk)] text-xl text-[#0E0E10] shadow-[4px_4px_0_var(--shadow)] transition-transform hover:-translate-y-0.5">
            →
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        data-lenis-prevent
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 pt-2 sm:gap-8 sm:px-8 lg:px-[max(2rem,calc((100vw-1400px)/2+2rem))]"
      >
        {REELS.map((r, i) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 40, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            className={`${r.panel} halftone group relative aspect-[9/16] w-[70vw] max-w-[270px] flex-none snap-start overflow-hidden border-2 border-[var(--edge)] shadow-[6px_6px_0_var(--shadow)] transition-transform duration-300 hover:-translate-y-2`}
          >
            <div className="flex items-center justify-between p-4">
              <span className="label border border-white/40 px-2 py-1 !text-[10px]">Reel {String(i + 1).padStart(2, "0")}</span>
              <span className="label !text-[10px] opacity-70">♥ {r.likes}</span>
            </div>

            <span aria-hidden className="f-display pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-[11rem] leading-none text-white/15 transition-transform duration-500 group-hover:scale-110">
              {r.name.charAt(0)}
            </span>

            <button
              aria-label={`Play ${r.name}'s story`}
              className="absolute left-1/2 top-[38%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center border-2 border-[#0E0E10] bg-[var(--yolk)] text-[#0E0E10] shadow-[4px_4px_0_#0E0E10] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4v16l14-8z" />
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="f-serif text-2xl leading-tight">
                &ldquo;We scaled our product 10x in just two months.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-white/25 pt-4">
                <span className="f-display grid h-10 w-10 place-items-center border-2 border-white/80 bg-white/10 text-lg">{r.name.charAt(0)}</span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.name}</span>
                  <span className="label block truncate !text-[10px] opacity-70">{r.company}</span>
                </span>
              </div>
            </div>
          </motion.article>
        ))}
        <div className="w-2 flex-none" />
      </div>
    </section>
  );
}
