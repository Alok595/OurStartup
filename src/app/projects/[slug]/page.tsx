import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/portfolio";
import ProjectDetailView from "@/components/ui/ProjectDetailView";

export const revalidate = 60; // 0-second cached ISR

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return {
      title: "Project Not Found | GenZDevWorks",
    };
  }

  return {
    title: `${project.title} | Case Study`,
    description: project.description || `Read about how we engineered ${project.title}.`,
    openGraph: {
      title: `${project.title} | GenZDevWorks Case Study`,
      description: project.description,
      images: project.heroImage ? [{ url: project.heroImage }] : [],
    },
  };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}