import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toDateOnly } from '@/lib/date';
import EnrollmentsManager from '@/components/admin/EnrollmentsManager';

export const metadata: Metadata = {
  title: 'Inscritos | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function InscritosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await prisma.courseSession.findUnique({ where: { id } });
  if (!session) notFound();

  const [course, enrollments] = await Promise.all([
    prisma.course.findUnique({ where: { slug: session.courseSlug } }),
    prisma.enrollment.findMany({ where: { courseSessionId: id }, orderBy: { createdAt: 'asc' } }),
  ]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark">
            Inscritos: {course?.title || session.courseSlug}
          </h1>
          <p className="text-brand-grey text-sm mt-1">
            {format(toDateOnly(session.startDate), "dd 'de' MMMM yyyy", { locale: es })} · {session.seatsTaken} / {session.seatsTotal} cupos ocupados
          </p>
        </div>
        <Link href="/admin-panel/capacitaciones" className="text-sm text-brand-teal hover:underline font-bold">
          &larr; Volver
        </Link>
      </div>

      <EnrollmentsManager initialEnrollments={enrollments} />
    </div>
  );
}
