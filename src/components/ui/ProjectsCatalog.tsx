"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import FAQSection, { FAQItem } from "@/components/ui/FAQSection";
import { Reveal, SplitWords } from "@/components/ui/motion";
import { ProjectCard, ProjectCardData, ProjectCardSkeleton } from "@/components/ui/ProjectCard";

export type Project = ProjectCardData & { _id: string };

const PROJECTS_FAQS: FAQItem[] = [
  {
    q: "How do you manage project timelines?",
    a: "We work with agile methodologies, breaking projects into manageable sprints to ensure consistent progress, regular feedback, and on-time delivery.",
  },
  {
    q: "Can I see the source code during development?",
    a: "Yes! We set up a private repository for your project from day one. You will have full access and transparency into our codebase.",
  },
  {
    q: "Do you handle deployment and hosting?",
    a: "We manage end-to-end deployment, typically utilizing cloud platforms like AWS, Vercel, or Google Cloud, depending on your architecture.",
  },
];

type LayoutSize = "small" | "medium" | "large";

const GRID: Record<LayoutSize, string> = {
  small: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  medium: "md:grid-cols-2 lg:grid-cols-3",
  large: "md:grid-cols-2",
};

export default function ProjectsCatalog({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);
  const [filter, setFilter] = useState("All");
  const [layout, setLayout] = useState<LayoutSize>("large");

  useEffect(() => {
    if (initialProjects.length > 0) return;
    (async () => {
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
    })();
  }, [initialProjects.length]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, [projects]);
  const filtered = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.category === filter)), [projects, filter]);

  return (
    <main className="min-h-screen bg-[var(--bg)] pt-28 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: PROJECTS_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      <div className="relative overflow-hidden px-5 pb-14 sm:px-8">
        <div aria-hidden className="ruled pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="label flex items-center gap-2 text-[var(--sub)]">
                <span className="inline-block h-3 w-3 bg-[var(--bubblegum)]" /> Portfolio
              </p>
            </Reveal>
            <h1 className="f-display mt-6 text-[17vw] text-[var(--ink)] sm:text-[12vw] lg:text-[10rem]">
              <SplitWords text="The work" onMount />
              <span className="f-serif ml-3 align-top text-[0.32em] text-[var(--accent)]">({isLoading ? "…" : projects.length})</span>
            </h1>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-md text-lg text-[var(--sub)]">
              Digital products, enterprise systems and high-performance apps — each one designed and engineered in-house.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Toolbar */}
      {!isLoading && projects.length > 0 && (
        <div className="sticky top-16 z-40 border-y-2 border-[var(--edge)] bg-[var(--paper)] sm:top-[72px]">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-3 sm:px-8">
            <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto" data-lenis-prevent>
              {categories.map((cat) => {
                const active = cat === filter;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    aria-pressed={active}
                    className={`label relative flex shrink-0 items-center gap-2 border-2 px-3 py-2 transition-colors ${
                      active ? "border-[#0E0E10] text-[#0E0E10]" : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--edge)]"
                    }`}
                  >
                    {active && (
                      <motion.span layoutId="filter-bg" className="absolute inset-0 bg-[var(--yolk)]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                    )}
                    <span className="relative">{cat}</span>
                    <span className="relative opacity-50">{counts[cat] ?? 0}</span>
                  </button>
                );
              })}
            </div>
            <div className="hidden shrink-0 border-2 border-[var(--edge)] sm:flex">
              {(["small", "medium", "large"] as const).map((size, i) => (
                <button
                  key={size}
                  onClick={() => setLayout(size)}
                  aria-label={`${size} grid`}
                  aria-pressed={layout === size}
                  className={`grid h-9 w-9 place-items-center transition-colors ${i > 0 ? "border-l-2 border-[var(--edge)]" : ""} ${
                    layout === size ? "bg-[var(--ink)] text-[var(--bg)]" : "text-[var(--ink)] hover:bg-[var(--line)]"
                  }`}
                >
                  <span className={`grid gap-[2px] ${size === "small" ? "grid-cols-3" : size === "medium" ? "grid-cols-2" : "grid-cols-1"}`}>
                    {Array.from({ length: size === "small" ? 9 : size === "medium" ? 4 : 1 }).map((_, k) => (
                      <span key={k} className={`bg-current ${size === "small" ? "h-[3px] w-[3px]" : size === "medium" ? "h-[5px] w-[5px]" : "h-3 w-3"}`} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
        <div className={`grid grid-cols-1 gap-x-8 gap-y-12 ${GRID[layout]}`}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-4 border-2 border-dashed border-[var(--line)] py-20 text-center text-[var(--sub)]">
              <p>
                Nothing in <strong className="text-[var(--ink)]">&ldquo;{filter}&rdquo;</strong> yet.
              </p>
              <button onClick={() => setFilter("All")} className="btn btn-yolk">
                Show everything
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => (
                <motion.div
                  key={project._id || project.slug}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: Math.min(idx, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={project} index={idx} compact={layout === "small"} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="border-t-2 border-[var(--edge)]">
        <FAQSection faqs={PROJECTS_FAQS} title="How projects run." />
      </div>
    </main>
  );
}
