"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, type Transition, type TargetAndTransition } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const prefersReducedMotion = useReducedMotion();
  const [lightbox, setLightbox] = useState<{ src: string; index: number | null } | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;

    let targetScroll = el.scrollTop;
    let currentScroll = el.scrollTop;
    let animId: number | null = null;
    let isRunning = false;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const update = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.14);
      el.scrollTop = currentScroll;

      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        animId = requestAnimationFrame(update);
      } else {
        el.scrollTop = targetScroll;
        isRunning = false;
        animId = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const canScrollDown = el.scrollTop < maxScroll - 2;
      const canScrollUp = el.scrollTop > 2;

      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
        e.preventDefault();
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY));
        if (!isRunning) {
          isRunning = true;
          currentScroll = el.scrollTop;
          animId = requestAnimationFrame(update);
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [project]);

  const fadeUp = (delay = 0): { initial: TargetAndTransition; whileInView?: TargetAndTransition; viewport?: object; transition: Transition } =>
    prefersReducedMotion
      ? { initial: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-30px" },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  // All images: heroImage first, followed by any gallery exhibits
  const allImages = [project.heroImage, ...(project.gallery || [])].filter(Boolean) as string[];
  const galleryLength = allImages.length;

  // Escape closes the lightbox; arrow keys page through images
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight" && lightbox.index !== null && galleryLength > 0) {
        const next = (lightbox.index + 1) % galleryLength;
        setLightbox({ src: allImages[next], index: next });
      }
      if (e.key === "ArrowLeft" && lightbox.index !== null && galleryLength > 0) {
        const prev = (lightbox.index - 1 + galleryLength) % galleryLength;
        setLightbox({ src: allImages[prev], index: prev });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, galleryLength, allImages]);

  // Reading progress tracking on scroll
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        setReadProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const metaItems = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Budget", value: project.budget },
    { label: "Timeline", value: project.duration },
  ].filter((item) => item.value);

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case "Premium":
        return "bg-gradient-to-r from-[#E6C27A] to-[#D4AF37] text-black";
      case "Featured":
        return "bg-gradient-to-r from-[#F9E596] to-[#E6C27A] text-black";
      case "Top Choice":
        return "bg-gradient-to-r from-[#FFDF00] to-[#D4AF37] text-black";
      case "Enterprise":
        return "bg-gradient-to-r from-[#C5A059] to-[#8C6239] text-white";
      case "Startup":
        return "bg-gradient-to-r from-[#F8F1CE] to-[#E2C792] text-black";
      default:
        return "bg-gradient-to-r from-[#E6C27A] to-[#D4AF37] text-black";
    }
  };

  return (
    <main className="relative min-h-screen bg-[var(--bg)]">
      {/* Reading Progress Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[90] bg-[var(--line)]">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{ width: `${readProgress * 100}%`, backgroundColor: project.color }}
        />
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close image"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>

          {galleryLength > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  const prev = ((lightbox.index ?? 0) - 1 + galleryLength) % galleryLength;
                  setLightbox({ src: allImages[prev], index: prev });
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  const next = ((lightbox.index ?? 0) + 1) % galleryLength;
                  setLightbox({ src: allImages[next], index: next });
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
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
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
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

      {/* Main Container: Full Width Custom Split (Left: 45%, Right: 55%) */}
      <div className="w-full pt-28 sm:pt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start w-full">
          
          {/* LEFT SIDE (45%): ALL DETAILS */}
          <div
            ref={detailsRef}
            data-lenis-prevent="true"
            className="w-full lg:w-[45%] shrink-0 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto px-6 sm:px-10 lg:pl-12 lg:pr-8 flex flex-col gap-8 scrollbar-thin scroll-smooth overscroll-contain"
          >
            {/* Back to Portfolio Link */}
            <div>
              <Link
                href="/projects"
                prefetch={true}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--sub)] hover:text-[var(--ink)] transition-colors group"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                Back to Portfolio
              </Link>
            </div>

            {/* Category Tag & Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {project.category}
              </span>
              {project.badge && (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm ${getBadgeStyles(project.badge)}`}>
                  {project.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--ink)] leading-[1.08]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
            </h1>

            {/* Client / Location subline if available */}
            {project.client && (
              <p className="text-base text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
                Designed & Built for <strong className="text-[var(--ink)] font-semibold">{project.client}</strong>
              </p>
            )}

            {/* Short Description */}
            {project.description && (
              <p
                className="text-base text-[var(--sub)] leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.description}
              </p>
            )}

            {/* Scope / Services */}
            {project.services && project.services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {project.services.map((service, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.03] dark:bg-white/[0.05] border border-[var(--line)] text-[var(--ink)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                    {service}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata Specs Grid */}
            {metaItems.length > 0 && (
              <div
                className="grid grid-cols-2 gap-y-5 gap-x-6 py-5 border-y border-[var(--line)]"
              >
                {metaItems.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sub)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-base sm:text-lg font-medium text-[var(--ink)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Overview Pull-Quote */}
            {project.overview && (
              <div
                className="relative pl-5 border-l-2 py-1"
                style={{ borderColor: project.color }}
              >
                <p
                  className="text-lg italic leading-relaxed text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                >
                  &ldquo;{project.overview}&rdquo;
                </p>
              </div>
            )}

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <div className="flex flex-col gap-4">
                {project.challenge && (
                  <div className="p-5 rounded-2xl border border-[var(--line)] bg-black/[0.01] dark:bg-white/[0.01] flex flex-col gap-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sub)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      The Challenge
                    </span>
                    <p className="text-sm text-[var(--sub)] leading-relaxed whitespace-pre-wrap">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-5 rounded-2xl border border-[var(--line)] bg-black/[0.01] dark:bg-white/[0.01] flex flex-col gap-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ fontFamily: "var(--font-mono)", color: project.color }}
                    >
                      The Solution
                    </span>
                    <p className="text-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Results / Impact */}
            {project.impact && project.impact.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sub)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Impact on Record
                </span>
                <div className="flex flex-col gap-2">
                  {project.impact.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--ink)]">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: project.color }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons (Inquire / Live Demo) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/contact"
                prefetch={true}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.15em] bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 transition-opacity"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Inquire Now
              </Link>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.15em] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Live Demo
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          {/* RIGHT SIDE (55%): FULL-WIDTH IMAGES */}
          <div className="w-full lg:w-[55%] flex flex-col">
            {allImages.length === 0 ? (
              <div
                className="aspect-video w-full rounded-2xl border border-[var(--line)] flex items-center justify-center text-[var(--sub)]"
                style={{ backgroundColor: `${project.color}10` }}
              >
                No images available for this project.
              </div>
            ) : (
              allImages.map((img, i) => {
                const isPrimary = i === 0;
                return (
                  <motion.div
                    key={i}
                    {...fadeUp(i === 0 ? 0 : 0.08)}
                    className="group relative w-full border-b-[3px] border-[var(--ink)]/50 dark:border-white/50 pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0"
                  >
                    <div
                      onClick={() => setLightbox({ src: img, index: i })}
                      className="relative w-full overflow-hidden cursor-pointer bg-black/[0.02] dark:bg-white/[0.02]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${project.title} — view ${i + 1}`}
                        className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                        loading={i === 0 ? "eager" : "lazy"}
                      />

                      <div className="absolute bottom-4 left-4 z-20">
                        <span
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] bg-black/80 backdrop-blur-md text-white shadow-md border border-white/10"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {isPrimary ? "Primary View" : `Exhibit ${String(i).padStart(2, "0")}`}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2.5 rounded-full bg-black/80 backdrop-blur-md text-white shadow-lg border border-white/10">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
