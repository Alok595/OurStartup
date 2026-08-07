"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
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
  services?: string[];
  heroImage?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  gallery?: string[];
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (isLoading) {
    return (
      <main className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[var(--bg)] pt-40 px-6 sm:px-10 max-w-6xl mx-auto flex flex-col gap-10`}>
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-6 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-16 w-3/4 max-w-2xl bg-black/5 dark:bg-white/5 animate-pulse rounded" />
          <div className="h-6 w-1/2 max-w-md bg-black/5 dark:bg-white/5 animate-pulse rounded" />
        </div>
        
        {/* Meta tags Skeleton */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-[var(--line)]">
          <div className="h-10 w-24 bg-black/5 dark:bg-white/5 animate-pulse rounded-xl" />
          <div className="h-10 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded-xl" />
          <div className="h-10 w-28 bg-black/5 dark:bg-white/5 animate-pulse rounded-xl" />
        </div>

        {/* Hero Image Skeleton */}
        <div className="w-full aspect-[21/9] rounded-3xl bg-black/5 dark:bg-white/5 animate-pulse mt-8" />
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[var(--bg)] pt-40 flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl text-[var(--ink)] font-bold" style={{ fontFamily: "var(--font-display)" }}>Project not found</h1>
          <Link href="/projects" className="text-[var(--accent)] underline font-medium text-lg">Return to all projects</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[var(--bg)]`}>
      
      {/* ---------------------------------------------------------
          1. HERO SECTION (MAGAZINE STYLE)
      --------------------------------------------------------- */}
      <section className="relative pt-32 pb-16 px-6 sm:px-10 overflow-hidden border-b border-[var(--line)]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] opacity-[0.06] pointer-events-none translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: project.color }} />
        
        <div className="mx-auto max-w-7xl relative z-10 flex flex-col gap-12">
          
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sub)] hover:text-[var(--ink)] transition-colors w-fit" style={{ fontFamily: "var(--font-mono)" }}>
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Left: Title & Overview */}
            <div className="flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="flex items-center gap-3"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)" }}>{project.category}</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                className="text-5xl font-bold tracking-tighter text-[var(--ink)] sm:text-6xl lg:text-7xl leading-[1.05]" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.title}
              </motion.h1>

              {project.overview && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                  className="text-xl text-[var(--sub)] leading-relaxed max-w-xl"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {project.overview}
                </motion.p>
              )}
            </div>

            {/* Right: Metadata Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="grid grid-cols-2 gap-x-8 gap-y-12 bg-black/[0.02] dark:bg-white/[0.02] rounded-3xl p-8 border border-[var(--line)]"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Client</span>
                <span className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{project.client || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Year</span>
                <span className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{project.year || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Approx. Budget</span>
                <span className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{project.budget || "Confidential"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Timeline</span>
                <span className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{project.duration || "N/A"}</span>
              </div>
              
              {project.services && project.services.length > 0 && (
                <div className="col-span-2 flex flex-col gap-2 pt-6 border-t border-[var(--line)]">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)] mb-2" style={{ fontFamily: "var(--font-mono)" }}>Services Provided</span>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, i) => (
                      <span key={i} className="text-sm font-medium px-3 py-1 bg-[var(--bg)] border border-[var(--line)] rounded-full text-[var(--ink)] shadow-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          2. FULL BLEED HERO IMAGE
      --------------------------------------------------------- */}
      {project.heroImage && (
        <section className="px-6 sm:px-10 py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="mx-auto max-w-7xl"
          >
            <div className="aspect-[16/7] w-full overflow-hidden rounded-3xl bg-[var(--line)] shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={project.heroImage} 
                alt={`${project.title} Hero`} 
                className="h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* ---------------------------------------------------------
          4. THE STORY (CHALLENGE & SOLUTION)
      --------------------------------------------------------- */}
      {(project.challenge || project.solution) && (
        <section className="px-6 sm:px-10 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl flex flex-col gap-20">
            
            {project.challenge && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                <div className="md:col-span-4">
                  <h3 className="text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>The Challenge</h3>
                </div>
                <div className="md:col-span-8">
                  <p className="text-xl text-[var(--sub)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {project.challenge}
                  </p>
                </div>
              </div>
            )}

            {project.solution && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                <div className="md:col-span-4">
                  <h3 className="text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>Our Solution</h3>
                </div>
                <div className="md:col-span-8 flex flex-col gap-8">
                  <p className="text-xl text-[var(--ink)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>
                    {project.solution}
                  </p>
                  
                  {project.impact && project.impact.length > 0 && (
                    <div className="p-8 rounded-3xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 mt-4">
                      <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--ink)]" style={{ fontFamily: "var(--font-mono)" }}>Key Results</h4>
                      <ul className="flex flex-col gap-5">
                        {project.impact.map((item, i) => (
                          <li key={i} className="flex items-start gap-4 text-[var(--ink)]">
                            <CheckCircle2 size={24} className="shrink-0 mt-0.5" style={{ color: project.color }} />
                            <span className="text-lg font-medium" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ---------------------------------------------------------
          5. MASONRY GALLERY
      --------------------------------------------------------- */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 sm:px-10 pb-32">
          <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(project.gallery.length, 2)} gap-8`}>
              {project.gallery.slice(0, 2).map((img, i) => (
                <div key={i} className="aspect-square w-full rounded-3xl overflow-hidden bg-[var(--line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Gallery detail ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
            {project.gallery.length > 2 && (
              <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[var(--line)] hidden md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.gallery[2]} alt="Gallery feature" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------
          6. CTA FOOTER
      --------------------------------------------------------- */}
      <section className="px-6 sm:px-10 py-32 border-t border-[var(--line)] bg-[var(--bg)] flex flex-col items-center justify-center gap-16">
        
        <div className="text-center flex flex-col items-center gap-10 relative z-10">
          <h2 className="text-5xl font-bold tracking-tighter text-[var(--ink)] sm:text-7xl leading-[1.1]" style={{ fontFamily: "var(--font-display)" }}>
            Ready to build <br/><span className="text-[var(--sub)] italic">something similar?</span>
          </h2>
          <Link href="/contact" className="group flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-white transition-transform hover:scale-110 active:scale-95 shadow-xl" style={{ backgroundColor: project.color, boxShadow: `0 20px 40px -10px ${project.color}50` }}>
            <ArrowRight size={32} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>

    </main>
  );
}
