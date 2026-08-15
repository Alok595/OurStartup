"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition, type TargetAndTransition } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";

// Fraunces gives the display type real character — a warm, editorial serif
// with room to swing from quiet (300) to a heavy stamped italic (900) —
// paired with Inter for reading and JetBrains Mono for "case file" data.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const EASE = [0.16, 1, 0.3, 1] as const;

type ProjectData = {
  title: string;
  category: string;
  year?: string;
  client?: string;
  color: string;
  budget?: string;
  duration?: string;
  liveUrl?: string;
  services?: string[];
  heroImage?: string;
  description?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  gallery?: string[];
};

type SectionKey = "overview" | "work" | "results" | "gallery";

const SECTION_LABELS: Record<SectionKey, string> = {
  overview: "Overview",
  work: "Challenge & Solution",
  results: "Results",
  gallery: "Gallery",
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const prefersReducedMotion = useReducedMotion();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; index: number | null } | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [readProgress, setReadProgress] = useState(0);

  const sectionRefs = useRef<Partial<Record<SectionKey, HTMLElement | null>>>({});

  const fadeUp = (delay = 0): { initial: TargetAndTransition; animate?: TargetAndTransition; whileInView?: TargetAndTransition; viewport?: object; transition: Transition } =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/portfolio/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setProject(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const galleryLength = project?.gallery?.length ?? 0;

  // Escape closes the lightbox; arrow keys page through the gallery.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight" && lightbox.index !== null && galleryLength > 0) {
        const next = (lightbox.index + 1) % galleryLength;
        setLightbox({ src: project!.gallery![next], index: next });
      }
      if (e.key === "ArrowLeft" && lightbox.index !== null && galleryLength > 0) {
        const prev = (lightbox.index - 1 + galleryLength) % galleryLength;
        setLightbox({ src: project!.gallery![prev], index: prev });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, galleryLength, project]);

  // Reading progress + active dossier tab, tracked on scroll.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        setReadProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);

        let current: SectionKey | null = null;
        (Object.keys(sectionRefs.current) as SectionKey[]).forEach((key) => {
          const el = sectionRefs.current[key];
          if (!el) return;
          if (el.getBoundingClientRect().top <= 180) current = key;
        });
        setActiveSection(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [project]);

  const scrollToSection = useCallback(
    (key: SectionKey) => {
      const el = sectionRefs.current[key];
      if (!el) return;
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    },
    [prefersReducedMotion]
  );

  const setSectionRef = (key: SectionKey) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  if (isLoading) {
    return (
      <main className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[var(--bg)] pt-40 px-6 sm:px-10 max-w-6xl mx-auto flex flex-col gap-10`}>
        <div className="flex flex-col gap-6">
          <div className="h-4 w-28 bg-black/5 dark:bg-white/5 animate-pulse rounded-full" />
          <div className="h-16 w-3/4 max-w-2xl bg-black/5 dark:bg-white/5 animate-pulse rounded-xl" />
          <div className="h-6 w-1/2 max-w-md bg-black/5 dark:bg-white/5 animate-pulse rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-4 pt-6 border-t border-dashed border-[var(--line)]">
          <div className="h-16 w-28 bg-black/5 dark:bg-white/5 animate-pulse rounded-2xl" />
          <div className="h-16 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded-2xl" />
          <div className="h-16 w-28 bg-black/5 dark:bg-white/5 animate-pulse rounded-2xl" />
        </div>
        <div className="w-full aspect-[21/9] rounded-3xl bg-black/5 dark:bg-white/5 animate-pulse mt-8" />
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[var(--bg)] flex items-center justify-center px-6`}>
        <div className="flex flex-col items-center gap-6 text-center">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border border-[var(--line)] text-[var(--sub)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Case file missing
          </span>
          <h1 className="text-4xl sm:text-5xl italic text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
            This project isn&apos;t on record.
          </h1>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[var(--ink)] font-medium text-lg underline decoration-2 underline-offset-4 hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded"
          >
            <ArrowLeft size={18} />
            Back to all projects
          </Link>
        </div>
      </main>
    );
  }

  const metaItems = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Budget", value: project.budget },
    { label: "Timeline", value: project.duration },
  ].filter((item) => item.value);

  const navItems: SectionKey[] = [
    project.overview ? "overview" : null,
    project.challenge || project.solution ? "work" : null,
    project.impact && project.impact.length > 0 ? "results" : null,
    project.gallery && project.gallery.length > 0 ? "gallery" : null,
  ].filter((v): v is SectionKey => v !== null);

  return (
    <main className={`${display.variable} ${body.variable} ${mono.variable} relative min-h-screen bg-[var(--bg)]`}>
      {/* Reading-progress rule — a case file "highlighted so far" strip */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[90] bg-[var(--line)]">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{ width: `${readProgress * 100}%`, backgroundColor: project.color }}
        />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close image"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X size={20} />
          </button>

          {lightbox.index !== null && galleryLength > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  const prev = (lightbox.index! - 1 + galleryLength) % galleryLength;
                  setLightbox({ src: project.gallery![prev], index: prev });
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  const next = (lightbox.index! + 1) % galleryLength;
                  setLightbox({ src: project.gallery![next], index: next });
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt="Fullscreen view"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl cursor-default"
          />

          {lightbox.index !== null && (
            <span
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {String(lightbox.index + 1).padStart(2, "0")} / {String(galleryLength).padStart(2, "0")}
            </span>
          )}
        </div>
      )}

      {/* Dossier index — sticky section rail, desktop only */}
      {navItems.length > 1 && (
        <nav
          aria-label="Section navigation"
          className="hidden xl:flex flex-col gap-5 fixed left-8 top-1/2 -translate-y-1/2 z-40"
        >
          {navItems.map((key, i) => {
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className="group flex items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded"
                style={{ outlineColor: project.color }}
              >
                <span
                  className="h-px transition-all duration-300"
                  style={{
                    width: isActive ? 28 : 12,
                    backgroundColor: isActive ? project.color : "var(--line)",
                  }}
                />
                <span
                  className="text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--ink)" : "var(--sub)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} — {SECTION_LABELS[key]}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ---------------------------------------------------------
          1. HERO
      --------------------------------------------------------- */}
      <section className="relative pt-32 sm:pt-40 pb-14 px-6 sm:px-10 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] opacity-[0.08] pointer-events-none translate-x-1/3 -translate-y-1/3"
          style={{ backgroundColor: project.color }}
        />

        <div className="mx-auto max-w-6xl relative z-10 flex flex-col gap-7">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sub)] hover:text-[var(--ink)] transition-colors w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <motion.div {...fadeUp(0)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
            <span
              className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {project.category}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[13vw] sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-[var(--ink)] max-w-4xl font-normal"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {project.title}
          </motion.h1>

          {project.description && (
            <motion.p
              {...fadeUp(0.14)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl text-[var(--sub)] leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {project.description}
            </motion.p>
          )}

          {project.liveUrl && (
            <motion.div {...fadeUp(0.2)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ backgroundColor: project.color, boxShadow: `0 8px 24px -6px ${project.color}60`, outlineColor: project.color }}
              >
                Visit Live Site
                <ExternalLink size={14} />
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------
          2. META — a stamped "ticket stub" of case-file facts
      --------------------------------------------------------- */}
      {(metaItems.length > 0 || (project.services && project.services.length > 0)) && (
        <section className="px-6 sm:px-10 mb-16 sm:mb-24">
          <motion.div
            {...fadeUp(0.05)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-6xl rounded-3xl border border-dashed relative overflow-hidden"
            style={{ borderColor: "var(--line)" }}
          >
            {metaItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-dashed" style={{ borderColor: "var(--line)" }}>
                {metaItems.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5 py-6 sm:py-7 px-5 sm:px-8">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{ fontFamily: "var(--font-mono)", color: project.color }}
                    >
                      {item.label}
                    </span>
                    <span className="text-base sm:text-lg font-medium text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {project.services && project.services.length > 0 && (
              <div
                className={`flex flex-wrap items-center gap-x-6 gap-y-3 px-5 sm:px-8 py-5 sm:py-6 ${
                  metaItems.length > 0 ? "border-t border-dashed" : ""
                }`}
                style={{ borderColor: "var(--line)" }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sub)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Scope
                </span>
                {project.services.map((service, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: project.color }} />
                    {service}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ---------------------------------------------------------
          3. HERO IMAGE
      --------------------------------------------------------- */}
      {project.heroImage && (
        <section className="px-6 sm:px-10 mb-16 sm:mb-24">
          <motion.div {...fadeUp(0)} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mx-auto max-w-6xl">
            <button
              onClick={() => setLightbox({ src: project.heroImage!, index: null })}
              className="block w-full aspect-[16/9] sm:aspect-[16/8] overflow-hidden rounded-3xl shadow-2xl group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ outlineColor: project.color }}
              aria-label="Open hero image full screen"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.heroImage}
                alt={`${project.title} hero`}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          </motion.div>
        </section>
      )}

      {/* ---------------------------------------------------------
          4. OVERVIEW — an oversized pull-quote
      --------------------------------------------------------- */}
      {project.overview && (
        <section
          ref={setSectionRef("overview")}
          className="px-6 sm:px-10 py-16 sm:py-28 scroll-mt-28"
        >
          <div className="mx-auto max-w-4xl relative">
            <span
              aria-hidden
              className="absolute -top-10 sm:-top-14 -left-2 sm:-left-6 text-[7rem] sm:text-[9rem] leading-none select-none pointer-events-none"
              style={{ fontFamily: "var(--font-display)", color: project.color, opacity: 0.15 }}
            >
              &ldquo;
            </span>
            <motion.p
              {...fadeUp(0)}
              className="relative text-2xl sm:text-4xl lg:text-[2.75rem] italic leading-[1.35] text-[var(--ink)] whitespace-pre-wrap"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              {project.overview}
            </motion.p>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------
          5. CHALLENGE & SOLUTION — a diptych
      --------------------------------------------------------- */}
      {(project.challenge || project.solution) && (
        <section
          ref={setSectionRef("work")}
          className="px-6 sm:px-10 py-16 sm:py-24 border-t border-[var(--line)] scroll-mt-28"
        >
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 md:divide-x divide-[var(--line)]">
            {project.challenge && (
              <motion.div {...fadeUp(0)} className="flex flex-col gap-4 pb-12 md:pb-0 md:pr-12">
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sub)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  The Problem
                </span>
                <h3 className="text-2xl sm:text-3xl text-[var(--ink)]" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  The Challenge
                </h3>
                <p className="text-lg text-[var(--sub)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>
                  {project.challenge}
                </p>
              </motion.div>
            )}

            {project.solution && (
              <motion.div
                {...fadeUp(0.1)}
                className="flex flex-col gap-4 pt-12 md:pt-0 md:pl-12 relative"
              >
                <span
                  aria-hidden
                  className="hidden md:block absolute -left-px top-0 bottom-0 w-px"
                  style={{ backgroundColor: project.color }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-mono)", color: project.color }}
                >
                  Our Approach
                </span>
                <h3 className="text-2xl sm:text-3xl text-[var(--ink)]" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  The Solution
                </h3>
                <p className="text-lg text-[var(--ink)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>
                  {project.solution}
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------
          6. RESULTS
      --------------------------------------------------------- */}
      {project.impact && project.impact.length > 0 && (
        <section
          ref={setSectionRef("results")}
          className="px-6 sm:px-10 py-16 sm:py-24 border-t border-[var(--line)] scroll-mt-28"
        >
          <div className="mx-auto max-w-6xl flex flex-col gap-8">
            <span
              className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sub)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Results on Record
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {project.impact.map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.06)}
                  className="flex items-start gap-4 p-6 rounded-2xl border border-[var(--line)]"
                >
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: project.color }} />
                  <span className="text-base font-medium text-[var(--ink)] leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------
          7. GALLERY
      --------------------------------------------------------- */}
      {project.gallery && project.gallery.length > 0 && (
        <section
          ref={setSectionRef("gallery")}
          className="px-6 sm:px-10 py-16 sm:py-24 border-t border-[var(--line)] scroll-mt-28"
        >
          <div className="mx-auto max-w-6xl flex flex-col gap-8">
            <span
              className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sub)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Gallery — {String(project.gallery.length).padStart(2, "0")} exhibits
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {project.gallery.map((img, i) => {
                const isWide = project.gallery!.length > 2 && i % 3 === 0;
                return (
                  <motion.button
                    key={i}
                    {...fadeUp(Math.min(i * 0.05, 0.3))}
                    onClick={() => setLightbox({ src: img, index: i })}
                    className={`group relative overflow-hidden rounded-2xl bg-[var(--line)] border border-[var(--line)] hover:shadow-xl transition-shadow duration-500 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                      isWide ? "sm:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                    }`}
                    style={{ outlineColor: project.color }}
                    aria-label={`Open gallery image ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${project.title} — exhibit ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------
          8. CTA FOOTER
      --------------------------------------------------------- */}
      <section className="px-6 sm:px-10 py-24 sm:py-32 border-t border-[var(--line)] flex flex-col items-center justify-center gap-14 relative overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-[0.06] pointer-events-none"
          style={{ backgroundColor: project.color }}
        />

        <div className="text-center flex flex-col items-center gap-10 relative z-10">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border"
            style={{ fontFamily: "var(--font-mono)", color: project.color, borderColor: project.color }}
          >
            Case closed — {project.year ?? "and counting"}
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-7xl tracking-tight text-[var(--ink)] leading-[1.08]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Ready to build <br className="hidden sm:block" />
            <span className="italic" style={{ color: project.color }}>something similar?</span>
          </h2>
          <Link
            href="/contact"
            className="group flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-white transition-transform hover:scale-110 active:scale-95 shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ backgroundColor: project.color, boxShadow: `0 20px 40px -10px ${project.color}50`, outlineColor: project.color }}
          >
            <ArrowRight size={32} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>

      {/* Mobile dossier index — horizontal pill nav */}
      {navItems.length > 1 && (
        <nav
          aria-label="Section navigation"
          className="xl:hidden sticky bottom-4 z-40 mx-4 mb-4 flex gap-2 overflow-x-auto rounded-full border border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md px-3 py-2 shadow-lg"
        >
          {navItems.map((key) => {
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className="shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  backgroundColor: isActive ? project.color : "transparent",
                  color: isActive ? "#fff" : "var(--sub)",
                  outlineColor: project.color,
                }}
              >
                {SECTION_LABELS[key]}
              </button>
            );
          })}
        </nav>
      )}
    </main>
  );
}