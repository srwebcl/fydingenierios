import React from 'react';
import Navbar from "@/components/layout/Navbar";
import { TrustBanner } from "@/components/ui/TrustBanner";
import Footer from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { prisma } from '@/lib/db';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.settings.findFirst();
  const whatsappNumber = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+56983894138';
  
  let tickerText = settings?.tickerText || "Especialistas en Confiabilidad de Activos y Mantenimiento Predictivo • Certificación Oficial de Informes Técnicos • Programas de Capacitación Técnica con Validación • ";
  
  try {
    const upcomingSessions = await prisma.courseSession.findMany({
      where: {
        status: { in: ['ABIERTA', 'CUPOS_LIMITADOS'] },
        startDate: { gte: new Date() }
      },
      orderBy: { startDate: 'asc' },
      take: 3
    });

    if (upcomingSessions.length > 0) {
      // Necesitamos obtener los títulos de los cursos porque CourseSession solo tiene el slug
      const slugs = upcomingSessions.map(s => s.courseSlug);
      const courses = await prisma.course.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, title: true }
      });

      const sessionStrings = upcomingSessions.map(session => {
        const course = courses.find(c => c.slug === session.courseSlug);
        const title = course ? course.title : session.courseSlug;
        const date = session.startDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
        return `${title} (${date})`;
      });

      tickerText = `🔥 PRÓXIMAS CAPACITACIONES: ${sessionStrings.join(' • ')} • ¡Inscríbete ahora! • `;
    }
  } catch (error) {
    console.error("Error fetching upcoming sessions for ticker:", error);
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-white">
      <Navbar />
      <TrustBanner text={tickerText} />
      <main className="flex-grow">{children}</main>
      <WhatsAppButton phoneNumber={whatsappNumber} />
      <Footer />
    </div>
  );
}
