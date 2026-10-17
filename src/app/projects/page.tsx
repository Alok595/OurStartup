import { Metadata } from "next";
import { getProjects } from "@/lib/portfolio";
import ProjectsCatalog from "@/components/ui/ProjectsCatalog";

export const revalidate = 60; // 0-second cached ISR

export const metadata: Metadata = {
  title: "Projects & Case Studies | Premium Digital Products",
  description: "Explore our portfolio of scalable web apps, mobile solutions, and enterprise software built by IIT engineers.",
  openGraph: {
    title: "Projects & Portfolio | GenZDevWorks",
    description: "Explore our complete portfolio of digital products, enterprise systems, and high-performance applications.",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsCatalog initialProjects={projects} />;
}
