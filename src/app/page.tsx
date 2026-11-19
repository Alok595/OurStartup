import Hero from "@/components/ui/Hero";
import IntroSection from "@/components/ui/IntroSection";
import StatsSection from "@/components/ui/StatsSection";
import WorkstationSection from "@/components/ui/WorkstationSection";
import ClientReelSection from "@/components/ui/ClientReelSection";
import ProjectsSection from "@/components/ui/ProjectsSection";
import SocialMarquee from "@/components/ui/SocialMarquee";
import TechMarquee from "@/components/ui/TechMarquee";
import CapabilitiesSection from "@/components/ui/CapabilitiesSection";
import ProcessSection from "@/components/ui/ProcessSection";
import { getProjects } from "@/lib/portfolio";

export const revalidate = 60;

export default async function Home() {
  const featuredProjects = await getProjects(true);

  return (
    <main className="relative w-full bg-[var(--bg)]">
      <Hero />
      <IntroSection />
      <CapabilitiesSection />
      <ProjectsSection initialProjects={featuredProjects.slice(0, 4)} />
      <ProcessSection />
      <StatsSection />
      <TechMarquee />
      <WorkstationSection />
      <ClientReelSection />
      <SocialMarquee />
    </main>
  );
}
