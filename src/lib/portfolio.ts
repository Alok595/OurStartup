import connectToDatabase from "@/lib/mongodb";
import Project, { IProject } from "@/models/Project";

export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  liveUrl?: string;
  heroImage?: string;
  badge?: string;
  year?: string;
  client?: string;
  budget?: string;
  duration?: string;
  services?: string[];
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  gallery?: string[];
  featured?: boolean;
  createdAt?: string;
}

export async function getProjects(featured?: boolean): Promise<ProjectItem[]> {
  try {
    await connectToDatabase();
    const query = featured ? { featured: true } : {};
    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Error fetching projects on server:", error);
    return [];
  }
}

export async function getProjectBySlug(slugOrId: string): Promise<ProjectItem | null> {
  try {
    await connectToDatabase();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
    let project;
    if (isObjectId) {
      project = await Project.findById(slugOrId).lean();
    } else {
      project = await Project.findOne({ slug: slugOrId }).lean();
    }
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error("Error fetching project by slug on server:", error);
    return null;
  }
}
