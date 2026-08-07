import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fydingenieria.cl';

  // Base routes
  const routes = [
    '',
    '/servicios',
    '/capacitaciones',
    '/certificados',
    '/quienes-somos',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Services
    const services = await prisma.service.findMany({
      select: { slug: true, updatedAt: true },
    });
    
    const serviceRoutes = services.map((service) => ({
      url: `${baseUrl}/servicios/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Dynamic Courses
    const courses = await prisma.course.findMany({
      select: { slug: true, updatedAt: true },
    });
    
    const courseRoutes = courses.map((course) => ({
      url: `${baseUrl}/capacitaciones/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...routes, ...serviceRoutes, ...courseRoutes];
  } catch (error) {
    // Fallback if db is unavailable during build
    return routes;
  }
}
