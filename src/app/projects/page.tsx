"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const EASE = [0.16, 1, 0.3, 1] as const;

type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  liveUrl?: string;
  heroImage?: string;
  badge?: string;
};

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const ProjectCardSkeleton = () => (
    <div className="flex flex-col gap-5 rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-6">
      <div className="aspect-video w-full rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        <div className="h-8 w-3/4 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        <div className="h-16 w-full bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        <div className="mt-4 pt-4 border-t border-[var(--line)]/60 flex gap-4">
          <div className="h-4 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  type LayoutSize = "small" | "medium" | "large";
  const [layoutSize, setLayoutSize] = useState<LayoutSize>("large");

  // Close filter on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [filterOpen]);

  const handleFilterSelect = useCallback((cat: string) => {
    setActiveFilter(cat);
    setFilterOpen(false);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const json = await res.json();
          setProjects(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Derive unique categories from fetched projects
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  }, [projects]);

  // Filter projects by selected category
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  return (
    <main className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[var(--bg)] pt-32 pb-24 px-6 sm:px-10`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 mb-20 text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-5xl font-bold tracking-tight text-[var(--ink)] sm:text-7xl" 
            style={{ fontFamily: "var(--font-display)" }}
          >
            All Projects.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="text-xl text-[var(--sub)]" 
            style={{ fontFamily: "var(--font-body)" }}
          >
            Explore our complete portfolio of digital products, enterprise systems, and high-performance mobile applications.
          </motion.p>
        </div>

        {/* ── Floating Toolbar (Filter + Layout Toggle) ── */}
        {!isLoading && categories.length > 1 && (
          <motion.div
            ref={filterRef}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            className="fixed bottom-[160px] right-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
          >
            <div className="flex flex-col items-end gap-3 pointer-events-auto relative">
              {/* Layout Toggle */}
              <div 
                className="flex flex-col items-center gap-1 rounded-full px-1.5 py-2 shadow-lg shadow-black/[0.06] dark:shadow-black/30"
                style={{
                  background: "color-mix(in srgb, var(--bg) 72%, transparent)",
                  backdropFilter: "blur(16px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                  border: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
                }}
              >
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setLayoutSize(size)}
                    className="p-1.5 rounded-full transition-colors relative flex items-center justify-center"
                    style={{ color: layoutSize === size ? "var(--bg)" : "var(--sub)" }}
                    aria-label={`${size} layout`}
                    title={`${size.charAt(0).toUpperCase() + size.slice(1)} layout`}
                  >
                    {layoutSize === size && (
                      <motion.span
                        layoutId="layout-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "var(--ink)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center h-4 w-4">
                      {size === "small" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                      )}
                      {size === "medium" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="4" width="8" height="16" rx="1"></rect><rect x="14" y="4" width="8" height="16" rx="1"></rect></svg>
                      )}
                      {size === "large" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect></svg>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* Collapsed filter trigger button */}
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className="flex flex-col items-center gap-3 rounded-full px-3 py-5 shadow-lg shadow-black/[0.06] dark:shadow-black/30 transition-all duration-300 hover:shadow-xl"
                style={{
                  background: "color-mix(in srgb, var(--bg) 72%, transparent)",
                  backdropFilter: "blur(16px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                  border: "1px solid color-mix(in srgb, var(--line) 60%, transparent)",
                  fontFamily: "var(--font-mono)",
                }}
                aria-expanded={filterOpen}
                aria-label="Toggle project filters"
              >
                {/* Filter icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--sub)] transition-transform duration-300"
                  style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="18" x2="14" y2="18" />
                </svg>

                <span 
                  className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)] whitespace-nowrap"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {activeFilter === "All" ? "Filter" : activeFilter}
                </span>

                {/* Count badge */}
                <span
                  className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums"
                  style={{
                    background: "color-mix(in srgb, var(--ink) 10%, transparent)",
                    color: "var(--sub)",
                  }}
                >
                  {filteredProjects.length}
                </span>

                {/* Chevron */}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--sub)] transition-transform duration-300"
                  style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Expanded dropdown */}
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute right-full bottom-0 mr-3 min-w-[280px] origin-bottom-right rounded-2xl p-2 shadow-xl shadow-black/[0.08] dark:shadow-black/40 z-50"
                    style={{
                      background: "color-mix(in srgb, var(--bg) 80%, transparent)",
                      backdropFilter: "blur(20px) saturate(1.8)",
                      WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                      border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      {categories.map((cat) => {
                        const isActive = cat === activeFilter;
                        const count = cat === "All"
                          ? projects.length
                          : projects.filter((p) => p.category === cat).length;
                        return (
                          <button
                            key={cat}
                            onClick={() => handleFilterSelect(cat)}
                            className="relative flex items-center justify-between rounded-xl px-4 py-2.5 text-left transition-colors duration-150"
                            style={{
                              fontFamily: "var(--font-mono)",
                              color: isActive ? "var(--bg)" : "var(--ink)",
                            }}
                            aria-pressed={isActive}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="filter-pill"
                                className="absolute inset-0 rounded-xl"
                                style={{ background: "var(--ink)" }}
                                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                              />
                            )}
                            <span className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.1em]">
                              {cat}
                            </span>
                            <span
                              className="relative z-10 text-[10px] font-bold tabular-nums"
                              style={{ opacity: isActive ? 0.7 : 0.4 }}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <div className={`grid grid-cols-1 gap-8 ${
          layoutSize === "small" 
            ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
            : layoutSize === "medium" 
              ? "md:grid-cols-2 lg:grid-cols-3" 
              : "md:grid-cols-2"
        }`}>
          {isLoading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-1 md:col-span-2 flex flex-col items-center justify-center gap-3 py-20 text-[var(--sub)]"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p style={{ fontFamily: "var(--font-body)" }}>
                No projects found in <strong>&ldquo;{activeFilter}&rdquo;</strong>.
              </p>
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)] hover:underline"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Clear filter
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const displayBadge = project.badge;
                
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
                <motion.div
                  key={project._id || project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.45, delay: idx * 0.04, ease: EASE }}
                  className="group relative flex flex-col gap-5 rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-6 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] h-full"
                >
                  <div 
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--line)]/50 bg-cover bg-center flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${project.color}15`,
                      backgroundImage: project.heroImage ? `url(${project.heroImage})` : undefined
                    }}
                  >
                    {/* Folded Corner Ribbon Badge */}
                    {displayBadge && (
                      <div className="absolute top-0 right-0 z-20 overflow-hidden w-28 h-28 pointer-events-none rounded-tr-2xl">
                        <div className={`absolute top-[22px] -right-[28px] w-[140px] rotate-45 text-center py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-lg border-y border-white/20 ${getBadgeStyles(displayBadge)}`}>
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                          {displayBadge}
                        </div>
                      </div>
                    )}
                    {!project.heroImage && (
                      <>
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{ backgroundImage: `radial-gradient(${project.color} 1px, transparent 1px)`, backgroundSize: '16px 16px' }}
                        />
                        <div 
                          className="h-24 w-24 rounded-full blur-[40px] transition-transform duration-700 group-hover:scale-150"
                          style={{ backgroundColor: project.color }}
                        />
                      </>
                    )}
                    {project.heroImage && (
                      <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 flex-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]" style={{ fontFamily: "var(--font-mono)" }}>
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)] line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                      {project.title}
                    </h3>
                    <p className="text-base text-[var(--sub)] leading-relaxed line-clamp-3" style={{ fontFamily: "var(--font-body)" }}>
                      {project.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-[var(--line)]/60 flex items-center justify-between gap-4 flex-wrap">
                      <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                        View Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--sub)] hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                          Live Demo
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
}

