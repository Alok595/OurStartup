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
  isErp?: boolean;
  showInWork?: boolean;
  erpFeatured?: boolean;
  freeTrial?: boolean;
  erpFeatures?: string[];
  createdAt?: string;
}

/** Projects without the flag predate it and count as Work. */
const IN_WORK = { showInWork: { $ne: false } };

export async function getProjects(featured?: boolean): Promise<ProjectItem[]> {
  try {
    await connectToDatabase();
    const query = featured ? { ...IN_WORK, featured: true } : IN_WORK;
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

/** Everything marked as an ERP, home-featured first. */
export async function getErps(): Promise<ProjectItem[]> {
  try {
    await connectToDatabase();
    const erps = await Project.find({ isErp: true }).sort({ erpFeatured: -1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(erps));
  } catch (error) {
    console.error("Error fetching ERPs on server:", error);
    return [];
  }
}

/** ERPs for the public site — falls back to the built-in ones until the admin adds any. */
export async function getErpList(): Promise<ProjectItem[]> {
  const { DEFAULT_ERPS } = await import("@/lib/erp");
  const erps = await getErps();
  return erps.length ? erps : DEFAULT_ERPS;
}

export async function getErpBySlug(slug: string): Promise<ProjectItem | null> {
  const erps = await getErpList();
  return erps.find((e) => e.slug === slug) ?? null;
}
