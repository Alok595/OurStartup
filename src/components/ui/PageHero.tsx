"use client";

import { motion } from "framer-motion";
import { Reveal, SplitWords } from "@/components/ui/motion";

export type HeroChip = { text: string; bg?: string };

/**
 * Shared top heading for the inner pages (ERP, Work, Services, About, Contact):
 * label → giant uppercase headline with a boxed, tilted highlight word → description + chips → actions.
 * Includes its own top padding to clear the fixed navbar, so the page wrapper shouldn't add any.
 */
export default function PageHero({
  label,
  labelColor = "var(--accent)",
  line1,
  line2,
  highlight,
  highlightBg = "var(--lime)",
  description,
  chips = [],
  actions,
  aside,
}: {
  label: string;
  labelColor?: string;
  line1: string;
  line2?: string;
  highlight: string;
  highlightBg?: string;
  description: React.ReactNode;
  chips?: HeroChip[];
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-34 sm:px-8 sm:pb-20 sm:pt-38">
      <div aria-hidden className="ruled pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_30%_40%,#000_20%,transparent_75%)]" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between gap-10">
          <div className="min-w-0">
            <Reveal>
              <p className="label flex items-center gap-2 text-[var(--sub)]">
                <span className="inline-block h-3 w-3" style={{ backgroundColor: labelColor }} /> {label}
              </p>
            </Reveal>
            <h1 className="f-display mt-6 text-[13vw] uppercase text-[var(--ink)] sm:text-[10vw] lg:text-[7.4vw] 2xl:text-[112px]">
              <SplitWords text={line1} onMount delay={0.05} />
              <span className="block">
                {line2 && (
                  <>
                    <SplitWords text={line2} onMount delay={0.2} />{" "}
                  </>
                )}
                <motion.span
                  initial={{ opacity: 0, rotate: -8, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: -3, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 14 }}
                  className="inline-block border-[3px] border-[var(--edge)] px-[0.14em] text-[#0E0E10] shadow-[6px_6px_0_var(--shadow)]"
                  style={{ backgroundColor: highlightBg }}
                >
                  {highlight}
                </motion.span>
              </span>
            </h1>
          </div>
          {aside && <div className="hidden shrink-0 md:block">{aside}</div>}
        </div>

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="max-w-2xl text-lg leading-snug text-[var(--sub)] sm:text-xl">{description}</p>
            {chips.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {chips.map((c) => (
                  <span
                    key={c.text}
                    className={`label border-2 px-3 py-2 ${c.bg ? "border-[#0E0E10] text-[#0E0E10]" : "border-[var(--edge)] bg-[var(--paper)] text-[var(--ink)]"}`}
                    style={c.bg ? { backgroundColor: c.bg } : undefined}
                  >
                    {c.text}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
          {actions && (
            <Reveal delay={0.1} className="hidden flex-wrap gap-4 lg:col-span-5 lg:flex lg:justify-end">
              {actions}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
