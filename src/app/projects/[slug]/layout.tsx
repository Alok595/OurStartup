import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    await connectToDatabase();
    const project = await Project.findOne({ slug: resolvedParams.slug }, { title: 1, description: 1, category: 1, heroImage: 1 }).lean();
    
    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: `${project.title} | ${project.category} | GenZDevWorks`,
      description: project.description || `Read our detailed case study on how we engineered and designed ${project.title}.`,
      openGraph: {
        title: `${project.title} | Case Study`,
        description: project.description || `A detailed case study on how we engineered and designed ${project.title}.`,
        images: project.heroImage ? [{ url: project.heroImage }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.description,
        images: project.heroImage ? [project.heroImage] : [],
      }
    };
  } catch (e) {
    return {
      title: "Project Case Study | GenZDevWorks",
    };
  }
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
