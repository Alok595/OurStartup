"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const SectionSkeleton = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center bg-[var(--bg)]">
    <div className="w-3/4 max-w-4xl h-64 rounded-3xl animate-pulse bg-black/5 dark:bg-white/5 border border-[var(--line)]" />
  </div>
);

const HeroSkeleton = () => (
  <div className="w-full h-screen bg-[var(--bg)] flex items-center justify-center">
    <div className="w-full h-full animate-pulse bg-black/5 dark:bg-white/5" />
  </div>
);

const Hero = dynamic(() => import("@/components/ui/Hero"), { loading: () => <HeroSkeleton /> });
const IntroSection = dynamic(() => import("@/components/ui/IntroSection"), { loading: () => <SectionSkeleton /> });
const WorkstationSection = dynamic(() => import("@/components/ui/WorkstationSection"), { loading: () => <SectionSkeleton /> });
const ClientReelSection = dynamic(() => import("@/components/ui/ClientReelSection"), { loading: () => <SectionSkeleton /> });
const ProjectsSection = dynamic(() => import("@/components/ui/ProjectsSection"), { loading: () => <SectionSkeleton /> });
const SocialMarquee = dynamic(() => import("@/components/ui/SocialMarquee"), { loading: () => <div className="h-32 w-full animate-pulse bg-black/5 dark:bg-white/5" /> });
const TechMarquee = dynamic(() => import("@/components/ui/TechMarquee"), { loading: () => <div className="h-32 w-full animate-pulse bg-black/5 dark:bg-white/5" /> });

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // The Hero section will move down at half the speed of the scroll, creating a parallax effect
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main ref={containerRef} className="w-full h-full relative bg-[var(--bg)]">
      {/* Hero container with Parallax */}
      <div className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 h-full w-full">
          <Hero />
        </motion.div>
      </div>

      {/* The rest of the content overlaps the Hero */}
      <div className="relative z-10 bg-[var(--bg)]">
        <IntroSection />
        <SocialMarquee />
        <WorkstationSection />
        <TechMarquee />
        <ClientReelSection />
        <ProjectsSection />
      </div>
    </main>
  );
}
