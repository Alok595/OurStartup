"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow, EASE, Marquee, Reveal, Spark } from "@/components/ui/motion";
import { ErpCardCompact } from "@/components/ui/ErpCard";
import { ERP_CUSTOMISE } from "@/lib/erp";
import type { ProjectItem } from "@/lib/portfolio";

/**
 * Homepage spotlight for our ERP products — sits right before "Six things".
 * Left: every ERP as a small card in a vertically scrolling box (home-marked first). Right: customisation card.
 */
export default function ErpSection({ erps }: { erps: ProjectItem[] }) {
  if (erps.length === 0) return null;
  const sorted = [...erps].sort((a, b) => Number(!!b.erpFeatured) - Number(!!a.erpFeatured));

  return (
    <section id="erp" className="relative overflow-hidden border-t-2 border-[var(--edge)] bg-[var(--lime)] px-5 py-14 text-[#0E0E10] sm:px-8 sm:py-20">
      <div aria-hidden className="ruled pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="label flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-[#0E0E10]" /> ERP Systems — ready to run
            </p>
            <h2 className="f-display mt-4 text-[11vw] uppercase leading-[0.9] sm:text-7xl lg:text-[6.2rem]">
              Run your business. <span className="f-serif normal-case text-[var(--grape)]">not spreadsheets.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/erp" className="btn btn-ink">
              All ERP systems <Arrow size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12">
          {/* Scrolling list of ERPs */}
          <Reveal className="lg:col-span-7">
            <div className="flex h-full flex-col border-[3px] border-[#0E0E10] bg-[#F3EFE6] shadow-[8px_8px_0_#0E0E10]">
              <div className="flex items-center justify-between border-b-[3px] border-[#0E0E10] bg-[#0E0E10] px-4 py-2.5 text-[#F3EFE6]">
                <span className="label !text-[11px]">Our ERPs</span>
                <span className="label !text-[10px] text-[var(--lime)]">
                  {String(sorted.length).padStart(2, "0")} live {sorted.length > 2 && "· scroll ↓"}
                </span>
              </div>
              <div
                data-lenis-prevent
                className="flex max-h-[460px] flex-col gap-4 overflow-y-auto overscroll-contain p-4 [scrollbar-color:#0E0E10_transparent] [scrollbar-width:thin] sm:p-5 lg:max-h-[520px]"
              >
                {sorted.map((erp, i) => (
                  <ErpCardCompact key={erp._id} erp={erp} index={i} />
                ))}
              </div>
              <Link href="/erp" className="label flex items-center justify-center gap-2 border-t-[3px] border-[#0E0E10] bg-[var(--yolk)] py-3 !text-[11px] transition-[filter] hover:brightness-95">
                Compare all ERPs <Arrow size={12} />
              </Link>
            </div>
          </Reveal>

          {/* Customisation card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex flex-col border-[3px] border-[#0E0E10] bg-[#0E0E10] p-6 text-[#F3EFE6] shadow-[8px_8px_0_var(--grape)] sm:p-8 lg:col-span-5"
          >
            <p className="label text-[var(--lime)]">Made your way</p>
            <h3 className="f-display mt-3 text-3xl uppercase sm:text-4xl">
              Customise <span className="text-[var(--yolk)]">everything.</span>
            </h3>
            <p className="mt-3 text-white/75">Every ERP we ship is shaped around how you work — not the other way round.</p>
            <ul className="mt-6 flex-1 divide-y divide-white/20 border-y border-white/20">
              {ERP_CUSTOMISE.map((c, i) => (
                <li key={c} className="flex items-center gap-4 py-3">
                  <span className="f-mono text-sm text-[var(--lime)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px]">{c}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn btn-yolk mt-6 self-start">
              Get a custom ERP <Arrow size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* customisation ticker */}
      <div className="relative mt-14 -mx-5 border-y-[3px] border-[#0E0E10] bg-[#0E0E10] py-3 text-[#F3EFE6] sm:-mx-8">
        <Marquee speed={40}>
          {["Fully customisable", ...ERP_CUSTOMISE].map((t) => (
            <span key={t} className="flex items-center gap-6 pr-6">
              <span className="f-display-narrow whitespace-nowrap text-xl uppercase sm:text-2xl">{t}</span>
              <Spark size={16} color="#CCFF2E" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
