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
};

import { useEffect, useState } from "react";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : projects.length === 0 ? (
            <div className="col-span-1 md:col-span-2 flex justify-center py-20 text-[var(--sub)]">No projects available.</div>
          ) : projects.map((project, idx) => (
            <motion.div 
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1), ease: EASE }}
              className="group relative flex flex-col gap-5 rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-6 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            >
              <div 
                className="aspect-video w-full rounded-2xl overflow-hidden relative flex items-center justify-center border border-[var(--line)]/50 bg-cover bg-center"
                style={{ 
                  backgroundColor: `${project.color}15`,
                  backgroundImage: project.heroImage ? `url(${project.heroImage})` : undefined
                }}
              >
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
              
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                  {project.title}
                </h3>
                <p className="text-base text-[var(--sub)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {project.description}
                </p>
                <div className="mt-4 pt-4 border-t border-[var(--line)]/60 flex items-center justify-between gap-4 flex-wrap">
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
          ))}
        </div>
      </div>
    </main>
  );
}
