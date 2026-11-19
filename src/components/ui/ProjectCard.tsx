"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "@/components/ui/motion";

export type ProjectCardData = {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  liveUrl?: string;
  heroImage?: string;
  badge?: string;
};

export const BADGE_COLORS: Record<string, string> = {
  Premium: "#FFD23F",
  Featured: "#34D399",
  "Top Choice": "#FF8FB4",
  Enterprise: "#60A5FA",
  Startup: "#FF9A6B",
};

export function ProjectCard({ project, index, compact = false }: { project: ProjectCardData; index: number; compact?: boolean }) {
  const color = project.color || "#059669";
  return (
    <article className="card-pop group relative flex h-full flex-col">
      {project.badge && (
        <span
          className="label absolute -right-3 -top-3 z-30 rotate-[6deg] border-2 border-[#0E0E10] px-2.5 py-1.5 !text-[10px] text-[#0E0E10] shadow-[3px_3px_0_#0E0E10] transition-transform duration-300 group-hover:rotate-0"
          style={{ backgroundColor: BADGE_COLORS[project.badge] ?? "#FFD23F" }}
        >
          {project.badge}
        </span>
      )}

      <Link
        href={`/projects/${project.slug}`}
        prefetch
        className="relative block aspect-[16/10] overflow-hidden border-b-2 border-[var(--edge)]"
        style={{ backgroundColor: `${color}22` }}
        aria-label={`View ${project.title}`}
      >
        {project.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.heroImage}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="relative grid h-full w-full place-items-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: `radial-gradient(${color} 1.4px, transparent 1.5px)`, backgroundSize: "14px 14px" }}
            />
            <span className="f-display relative text-[22vw] leading-none opacity-90 sm:text-[9rem]" style={{ color }}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* colour wipe on hover */}
        <span
          aria-hidden
          className="absolute inset-0 flex translate-y-full items-end p-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0"
          style={{ background: `linear-gradient(to top, ${color} 0%, ${color}cc 35%, transparent 75%)` }}
        >
          <span className="label flex items-center gap-2 text-white">
            Read the case <Arrow size={14} />
          </span>
        </span>

        <span className="label absolute left-3 top-3 border-2 border-[#0E0E10] bg-[#FFFDF8] px-2 py-1 !text-[10px] text-[#0E0E10]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "gap-2 p-4" : "gap-3 p-5 sm:p-6"}`}>
        <span className="label flex items-center gap-2 text-[var(--sub)]">
          <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: color }} />
          {project.category}
        </span>
        <h3 className={`f-display-narrow leading-[1.02] text-[var(--ink)] ${compact ? "text-xl" : "text-2xl sm:text-[1.9rem]"}`}>
          <Link href={`/projects/${project.slug}`} className="link-wipe">
            {project.title}
          </Link>
        </h3>
        {!compact && <p className="line-clamp-3 text-[16px] leading-relaxed text-[var(--sub)]">{project.description}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
          <Link
            href={`/projects/${project.slug}`}
            prefetch
            className="label inline-flex items-center gap-2 border-2 border-[var(--edge)] px-3 py-2 text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            Details <Arrow size={12} />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="label inline-flex items-center gap-2 px-1 py-2 text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col border-2 border-[var(--line)]">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="flex flex-col gap-3 p-6">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-7 w-3/4" />
        <div className="skeleton h-14 w-full" />
      </div>
    </div>
  );
}

export function StaggerItem({ children, index, className }: { children: React.ReactNode; index: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
