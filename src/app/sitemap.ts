import { MetadataRoute } from 'next';
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://genzdevworks.ratnahomes.in'; // Change this to your actual production domain later
  
  // Static core routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Projects fetched from MongoDB)
  let projectRoutes: MetadataRoute.Sitemap = [];
  
  try {
    await connectToDatabase();
    // We only need slug and timestamps to build the sitemap
    const projects = await Project.find({}, { slug: 1, updatedAt: 1, createdAt: 1 });
    
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      // Use updatedAt if available, fallback to createdAt or current date
      lastModified: project.updatedAt || project.createdAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to fetch projects for sitemap:", error);
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...projectRoutes];
}
