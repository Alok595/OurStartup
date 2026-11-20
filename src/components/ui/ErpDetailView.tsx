"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Arrow, EASE, Reveal, Spark } from "@/components/ui/motion";
import ErpCard, { ErpMock, hostOf, inkOn } from "@/components/ui/ErpCard";
import { ERP_CUSTOMISE, erpCta, erpDemoLink, erpImages, splitErpTitle } from "@/lib/erp";
import type { ProjectItem } from "@/lib/portfolio";

export default function ErpDetailView({ erp, others }: { erp: ProjectItem; others: ProjectItem[] }) {
  const color = erp.color || "#4F46E5";
  const fg = inkOn(color);
  const { brand, name } = splitErpTitle(erp.title);
  const cta = erpCta(erp);
  const images = erpImages(erp);
  const count = images.length;
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, count]);

  const story = [
    { label: "About", text: erp.overview },
    { label: "The problem", text: erp.challenge },
    { label: "How it solves it", text: erp.solution },
  ].filter((s) => s.text);

  const meta = [
    { label: "Type", value: erp.category },
    { label: "Trial", value: erp.freeTrial ? "Free trial available" : "Demo on request" },
    { label: "Year", value: erp.year },
    { label: "Built for", value: erp.client },
  ].filter((m) => m.value);

  return (
    <main className="relative min-h-screen bg-[var(--bg)] pt-24 sm:pt-28">
      {/* ------------------------------------------------------- lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0E0E10]/95 p-4 sm:p-12"
            onClick={() => setLightbox(null)}
            data-lenis-prevent
          >
            <button onClick={() => setLightbox(null)} aria-label="Close image" className="absolute right-5 top-5 grid h-11 w-11 place-items-center border-2 border-white bg-[#0E0E10] text-white hover:bg-[var(--yolk)] hover:text-[#0E0E10]">
              <X size={20} />
            </button>
            {count > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((i) => ((i ?? 0) - 1 + count) % count);
                  }}
                  className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border-2 border-white bg-[#0E0E10] text-white hover:bg-[var(--yolk)] hover:text-[#0E0E10] sm:left-8"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((i) => ((i ?? 0) + 1) % count);
                  }}
                  className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border-2 border-white bg-[#0E0E10] text-white hover:bg-[var(--yolk)] hover:text-[#0E0E10] sm:right-8"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox}
                src={images[lightbox]}
                alt={`${erp.title} — screen ${lightbox + 1}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="max-h-full max-w-full border-2 border-white object-contain"
              />
            </AnimatePresence>
            <span className="label absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70">
              {String(lightbox + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------ head */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/erp" prefetch className="label group inline-flex items-center gap-2 text-[var(--sub)] hover:text-[var(--ink)]">
            <span className="transition-transform group-hover:-translate-x-1">←</span> All ERP systems
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="label border-2 border-[#0E0E10] px-2.5 py-1.5 !text-[10px]" style={{ backgroundColor: color, color: fg }}>
                  {erp.category || "ERP System"}
                </span>
                {erp.freeTrial && <span className="label border-2 border-[#0E0E10] bg-[var(--yolk)] px-2.5 py-1.5 !text-[10px] text-[#0E0E10]">Free trial</span>}
                <span className="label border-2 border-[#0E0E10] bg-[#FF8FB4] px-2.5 py-1.5 !text-[10px] text-[#0E0E10]">Fully customisable</span>
              </div>
              {brand && <p className="label mt-6 text-[var(--sub)]">{brand}</p>}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="f-display mt-2 text-5xl text-[var(--ink)] sm:text-6xl lg:text-[5rem]"
              >
                {name}
              </motion.h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--sub)] sm:text-xl">{erp.description}</p>
            </div>

            <div className="flex flex-col justify-end gap-4 lg:col-span-5">
              <dl className="grid grid-cols-2 border-l-2 border-t-2 border-[var(--edge)]">
                {meta.map((m) => (
                  <div key={m.label} className="border-b-2 border-r-2 border-[var(--edge)] p-4">
                    <dt className="label text-[var(--sub)]">{m.label}</dt>
                    <dd className="mt-1 font-semibold text-[var(--ink)]">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3">
                <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn btn-yolk">
                  {cta.label} <Arrow size={14} />
                </a>
                {erp.liveUrl && (
                  <a href={erpDemoLink(erp.title)} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
                    Book a demo
                  </a>
                )}
                <Link href="/contact" className="btn btn-ink">
                  Customise it
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- showcase */}
      <section className="px-5 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="overflow-hidden border-[3px] border-[#0E0E10] bg-[#FFFDF8] shadow-[10px_10px_0_#0E0E10]">
            <div className="flex items-center gap-1.5 border-b-[3px] border-[#0E0E10] px-3 py-2" style={{ backgroundColor: color, color: fg }}>
              {["#FF5A1F", "#FFD23F", "#34D399"].map((c) => (
                <span key={c} className="h-3 w-3 border-2 border-[#0E0E10]" style={{ backgroundColor: c }} />
              ))}
              <span className="f-mono ml-3 truncate border-2 border-[#0E0E10] bg-[#FFFDF8] px-2 py-0.5 text-[11px] text-[#0E0E10]">{hostOf(erp.liveUrl)}</span>
              {count > 0 && (
                <span className="label ml-auto !text-[10px]">
                  Screen {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              )}
            </div>
            {count > 0 ? (
              <button type="button" onClick={() => setLightbox(active)} className="group relative block w-full" aria-label="Open full screen">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[active]}
                    src={images[active]}
                    alt={`${erp.title} — screen ${active + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="block h-auto max-h-[78vh] w-full object-contain object-top"
                  />
                </AnimatePresence>
                <span className="label absolute bottom-4 right-4 flex items-center gap-2 border-2 border-[#0E0E10] bg-[#FFFDF8] px-3 py-2 text-[#0E0E10] opacity-0 shadow-[3px_3px_0_#0E0E10] transition-opacity group-hover:opacity-100">
                  <Maximize2 size={12} /> View full size
                </span>
              </button>
            ) : (
              <div className="aspect-[16/8]">
                <ErpMock color={color} letter={(brand || name).charAt(0)} />
              </div>
            )}
          </div>

          {count > 1 && (
            <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show screen ${i + 1}`}
                  className={`relative w-40 shrink-0 overflow-hidden border-[3px] transition-all sm:w-52 ${
                    i === active ? "-translate-y-1 border-[#0E0E10] shadow-[5px_5px_0_#0E0E10]" : "border-[var(--line)] opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover object-left-top" />
                  <span className="label absolute left-1.5 top-1.5 border border-[#0E0E10] bg-[#FFFDF8] px-1.5 !text-[9px] text-[#0E0E10]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------- features */}
      {erp.erpFeatures && erp.erpFeatures.length > 0 && (
        <section className="px-5 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-[1400px]">
            <Reveal>
              <p className="label text-[var(--sub)]">What&apos;s inside</p>
              <h2 className="f-display mt-4 text-5xl uppercase text-[var(--ink)] sm:text-7xl">
                Every <span className="f-serif normal-case" style={{ color }}>module.</span>
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {erp.erpFeatures.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
                  whileHover={{ y: -4 }}
                  className="flex items-start gap-3 border-2 border-[#0E0E10] bg-[#FFFDF8] p-5 text-[#0E0E10] shadow-[4px_4px_0_#0E0E10]"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center border-2 border-[#0E0E10] f-mono text-[11px]" style={{ backgroundColor: color, color: fg }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="f-display-narrow text-lg uppercase leading-tight">{f}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- story */}
      {story.length > 0 && (
        <section className="px-5 pt-20 sm:px-8 sm:pt-28">
          <div className={`mx-auto grid max-w-[1400px] gap-8 ${story.length > 1 ? "lg:grid-cols-3" : ""}`}>
            {story.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="border-t-[3px] border-[var(--edge)] pt-5">
                <p className="label flex items-center gap-2 text-[var(--sub)]">
                  <span className="inline-block h-3 w-3" style={{ backgroundColor: color }} /> {s.label}
                </p>
                <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-[var(--ink)]">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------- impact & stack */}
      {((erp.impact && erp.impact.length > 0) || (erp.services && erp.services.length > 0)) && (
        <section className="px-5 pt-16 sm:px-8">
          <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2">
            {erp.impact?.map((m) => (
              <span key={m} className="label flex items-center gap-2 border-2 border-[#0E0E10] bg-[var(--lime)] px-3 py-2 text-[#0E0E10]">
                <Spark size={12} color="#0E0E10" /> {m}
              </span>
            ))}
            {erp.services?.map((s) => (
              <span key={s} className="label border-2 border-[var(--edge)] bg-[var(--paper)] px-3 py-2 text-[var(--ink)]">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- customise */}
      <section className="mt-20 border-y-2 border-[var(--edge)] bg-[var(--navy)] px-5 py-16 text-[#F3F4FA] sm:mt-28 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="label text-[var(--lime)]">Make it yours</p>
            <h2 className="f-display mt-4 text-4xl uppercase leading-[0.9] sm:text-6xl">
              Customise <span className="text-[var(--yolk)]">{brand || "this ERP"}.</span>
            </h2>
            <p className="mt-4 max-w-md text-white/75">Everything you see above can be changed to match how your business works.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-yolk">
                Request customisation <Arrow size={14} />
              </Link>
              <a href={cta.href} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
                {cta.label}
              </a>
            </div>
          </Reveal>
          <ul className="grid border-l border-t border-white/70 sm:grid-cols-2 lg:col-span-7">
            {ERP_CUSTOMISE.map((c, i) => (
              <li key={c} className="border-b border-r border-white/70 p-5">
                <span className="f-mono text-sm text-[var(--lime)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="f-display-narrow mt-3 text-lg">{c}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- others */}
      {others.length > 0 && (
        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-end justify-between gap-4">
              <h2 className="f-display text-4xl uppercase text-[var(--ink)] sm:text-6xl">More ERPs</h2>
              <Link href="/erp" className="label link-wipe text-[var(--ink)]">
                View all →
              </Link>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {others.slice(0, 2).map((o, i) => (
                <ErpCard key={o._id} erp={o} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
