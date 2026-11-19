"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow, Reveal, SplitWords } from "@/components/ui/motion";
import { ProjectCard, ProjectCardData, ProjectCardSkeleton, StaggerItem } from "@/components/ui/ProjectCard";

export default function ProjectsSection({ initialProjects = [] }: { initialProjects?: ProjectCardData[] }) {
  const [projects, setProjects] = useState<ProjectCardData[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);

  // Server already handed us data in the normal case; only fall back to the API when it didn't.
  useEffect(() => {
    if (initialProjects.length > 0) return;
    (async () => {
      try {
        const res = await fetch("/api/portfolio?featured=true");
        if (res.ok) {
          const json = await res.json();
          setProjects(json.data?.slice(0, 4) || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [initialProjects.length]);

  return (
    <section className="relative border-t-2 border-[var(--edge)] bg-[var(--paper)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="label flex items-center gap-2 text-[var(--sub)]">
                <span className="inline-block h-3 w-3 bg-[var(--bubblegum)]" /> (02) Selected work
              </p>
            </Reveal>
            <h2 className="f-display mt-6 text-[11vw] text-[var(--ink)] sm:text-7xl lg:text-[6.2rem]">
              <SplitWords text="Fresh" />{" "}
              <span className="f-serif text-[0.95em] text-[var(--accent)]">
                <SplitWords text="off the press" delay={0.15} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2} className="flex flex-col items-start gap-5 md:items-end md:text-right">
            <p className="max-w-sm text-lg text-[var(--sub)]">Products where sharp design meets engineering that holds up under real traffic.</p>
            <Link href="/projects" className="btn btn-ink">
              All projects <Arrow size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          ) : projects.length === 0 ? (
            <div className="col-span-full border-2 border-dashed border-[var(--line)] py-20 text-center text-[var(--sub)]">
              New work landing soon.
            </div>
          ) : (
            projects.map((p, idx) => (
              <StaggerItem key={p._id ?? p.slug} index={idx} className={idx % 2 === 1 ? "md:translate-y-12" : ""}>
                <ProjectCard project={p} index={idx} />
              </StaggerItem>
            ))
          )}
        </div>
        <div className="hidden h-12 md:block" />
      </div>
    </section>
  );
}
