import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    await connectToDatabase();
    const project = await Project.findOne({ slug: resolvedParams.slug });
    
    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: `${project.title} - ${project.category}`,
      description: project.description || `Read our detailed case study on ${project.title}.`,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.heroImage ? [project.heroImage] : [],
      },
    };
  } catch (e) {
    return {
      title: "Project Case Study",
    };
  }
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
