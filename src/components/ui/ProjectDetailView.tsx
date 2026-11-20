"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Arrow, EASE } from "@/components/ui/motion";
import { BADGE_COLORS } from "@/components/ui/ProjectCard";

export type ProjectData = {
  title: string;
  category: string;
  year?: string;
  client?: string;
  color: string;
  budget?: string;
  duration?: string;
  liveUrl?: string;
  badge?: string;
  services?: string[];
  heroImage?: string;
  description?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  gallery?: string[];
};

export default function ProjectDetailView({ project }: { project: ProjectData }) {
  const reduced = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const color = project.color || "#059669";

  const images = [project.heroImage, ...(project.gallery || [])].filter(Boolean) as string[];
  const count = images.length;

  // Eased wheel scrolling inside the sticky details column (desktop)
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    let target = el.scrollTop;
    let current = el.scrollTop;
    let raf: number | null = null;

    const step = () => {
      current += (target - current) * 0.14;
      el.scrollTop = current;
      if (Math.abs(target - current) > 0.5) raf = requestAnimationFrame(step);
      else {
        el.scrollTop = target;
        raf = null;
      }
    };
    const onWheel = (e: WheelEvent) => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return;
      const down = e.deltaY > 0 && el.scrollTop < max - 2;
      const up = e.deltaY < 0 && el.scrollTop > 2;
      if (!down && !up) return;
      e.preventDefault();
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (raf === null) {
        current = el.scrollTop;
        raf = requestAnimationFrame(step);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [project]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, count]);

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Budget", value: project.budget },
    { label: "Timeline", value: project.duration },
  ].filter((m) => m.value);

  return (
    <main className="relative min-h-screen bg-[var(--bg)]">
      <motion.div aria-hidden style={{ scaleX: progress, backgroundColor: color }} className="fixed left-0 right-0 top-0 z-[90] h-1 origin-left" />

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
                alt={`${project.title} — view ${lightbox + 1}`}
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

      <div className="flex w-full flex-col items-start gap-10 pb-24 pt-24 sm:pt-28 lg:flex-row lg:gap-0">
        {/* Details */}
        <div
          ref={detailsRef}
          data-lenis-prevent="true"
          className="no-scrollbar flex w-full shrink-0 flex-col gap-8 px-5 sm:px-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-[44%] lg:overflow-y-auto lg:border-r-2 lg:border-[var(--edge)] lg:pl-10 lg:pr-10"
        >
          <Link href="/projects" prefetch className="label group inline-flex w-fit items-center gap-2 text-[var(--sub)] hover:text-[var(--ink)]">
            <span className="transition-transform group-hover:-translate-x-1">←</span> All projects
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="label flex items-center gap-2 border-2 border-[var(--edge)] px-2.5 py-1.5 text-[var(--ink)]">
              <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} />
              {project.category}
            </span>
            {project.badge && (
              <span className="label -rotate-2 border-2 border-[#0E0E10] px-2.5 py-1.5 text-[#0E0E10] shadow-[3px_3px_0_#0E0E10]" style={{ backgroundColor: BADGE_COLORS[project.badge] ?? "#FFD23F" }}>
                {project.badge}
              </span>
            )}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="f-display text-[9.5vw] text-[var(--ink)] sm:text-6xl lg:text-[4.2rem]"
          >
            {project.title}
          </motion.h1>

          {project.client && (
            <p className="f-serif -mt-3 text-2xl text-[var(--sub)]">
              made for <span className="text-[var(--ink)]">{project.client}</span>
            </p>
          )}

          {project.description && <p className="text-lg leading-relaxed text-[var(--sub)]">{project.description}</p>}

          {project.services && project.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.services.map((s) => (
                <span key={s} className="label border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1.5 text-[var(--ink)]">
                  {s}
                </span>
              ))}
            </div>
          )}

          {meta.length > 0 && (
            <dl className="grid grid-cols-2 border-l-2 border-t-2 border-[var(--edge)]">
              {meta.map((m) => (
                <div key={m.label} className="border-b-2 border-r-2 border-[var(--edge)] p-4">
                  <dt className="label text-[var(--sub)]">{m.label}</dt>
                  <dd className="f-display-narrow mt-1.5 text-xl text-[var(--ink)]">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.overview && (
            <blockquote className="border-l-[6px] py-1 pl-5" style={{ borderColor: color }}>
              <p className="f-serif text-2xl leading-snug text-[var(--ink)]">&ldquo;{project.overview}&rdquo;</p>
            </blockquote>
          )}

          {project.challenge && (
            <section className="border-2 border-[var(--edge)] bg-[var(--paper)]">
              <h2 className="label border-b-2 border-[var(--edge)] px-4 py-2.5 text-[var(--sub)]">The challenge</h2>
              <p className="whitespace-pre-wrap p-4 leading-relaxed text-[var(--sub)]">{project.challenge}</p>
            </section>
          )}
          {project.solution && (
            <section className="border-2 border-[var(--edge)] bg-[var(--paper)] shadow-[5px_5px_0_var(--shadow)]">
              <h2 className="label flex items-center gap-2 border-b-2 border-[var(--edge)] bg-[var(--ink)] px-4 py-2.5 text-[var(--bg)]">
                <span className="h-2.5 w-2.5" style={{ backgroundColor: color }} />
                The solution
              </h2>
              <p className="whitespace-pre-wrap p-4 leading-relaxed text-[var(--ink)]">{project.solution}</p>
            </section>
          )}

          {project.impact && project.impact.length > 0 && (
            <section>
              <h2 className="label text-[var(--sub)]">Impact on record</h2>
              <ul className="mt-3 flex flex-col">
                {project.impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-[var(--line)] py-3 text-[var(--ink)]">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0" style={{ backgroundColor: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex flex-col gap-3 pb-4 sm:flex-row">
            <Link href="/contact" prefetch className="btn btn-yolk flex-1">
              Build something like this <Arrow size={14} />
            </Link>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-paper flex-1">
                Live site ↗
              </a>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="flex w-full flex-col gap-6 px-5 sm:px-8 lg:w-[56%] lg:pl-10">
          {count === 0 ? (
            <div className="grid aspect-video w-full place-items-center border-2 border-dashed border-[var(--line)] text-[var(--sub)]" style={{ backgroundColor: `${color}14` }}>
              Screens coming soon.
            </div>
          ) : (
            images.map((img, i) => (
              <motion.figure
                key={img + i}
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, ease: EASE }}
                className="group relative cursor-zoom-in overflow-hidden border-2 border-[var(--edge)] bg-[var(--paper)] shadow-[6px_6px_0_var(--shadow)]"
                onClick={() => setLightbox(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${project.title} — view ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-auto w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.015]"
                />
                <figcaption className="label absolute bottom-3 left-3 border-2 border-[#0E0E10] bg-[#FFFDF8] px-2 py-1 text-[#0E0E10]">
                  {i === 0 ? "Primary view" : `Exhibit ${String(i).padStart(2, "0")}`}
                </figcaption>
                <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center border-2 border-[#0E0E10] bg-[var(--yolk)] text-[#0E0E10] opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 size={16} />
                </span>
              </motion.figure>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
