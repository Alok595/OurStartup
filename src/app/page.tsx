import HeroParallaxWrapper from "@/components/ui/HeroParallaxWrapper";
import Hero from "@/components/ui/Hero";
import IntroSection from "@/components/ui/IntroSection";
import StatsSection from "@/components/ui/StatsSection";
import WorkstationSection from "@/components/ui/WorkstationSection";
import ClientReelSection from "@/components/ui/ClientReelSection";
import ProjectsSection from "@/components/ui/ProjectsSection";
import SocialMarquee from "@/components/ui/SocialMarquee";
import TechMarquee from "@/components/ui/TechMarquee";
import { getProjects } from "@/lib/portfolio";

export const revalidate = 60; // 0-second cached ISR

export default async function Home() {
  const featuredProjects = await getProjects(true);

  return (
    <main className="w-full h-full relative bg-[var(--bg)]">
      {/* Hero container with Parallax */}
      <HeroParallaxWrapper>
        <Hero />
      </HeroParallaxWrapper>

      {/* The rest of the content overlaps the Hero */}
      <div className="relative z-10 bg-[var(--bg)]">
        <IntroSection />
        <StatsSection />
        <SocialMarquee />
        <WorkstationSection />
        <TechMarquee />
        <ClientReelSection />
        <ProjectsSection initialProjects={featuredProjects.slice(0, 4)} />
      </div>
    </main>
  );
}
