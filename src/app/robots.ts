import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/api/', 
        '/login/', 
        '/register/'
      ], // Protect admin/auth routes from search engine indexing
    },
    sitemap: 'https://startupour.com/sitemap.xml',
  };
}
