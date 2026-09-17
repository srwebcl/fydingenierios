import React from 'react';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EnrollmentForm } from '@/components/capacitaciones/EnrollmentForm';

export const dynamic = 'force-dynamic';

export default async function InscripcionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await prisma.courseSession.findUnique({ where: { id } });
  const course = session ? await prisma.course.findUnique({ where: { slug: session.courseSlug } }) : null;

  if (!session || !course) {
    return (
      <main className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-bold text-brand-dark mb-4">Sesión no encontrada</h1>
        <p className="text-brand-grey mb-8">El link de inscripción no es válido o el curso ya no está disponible.</p>
        <Link href="/capacitaciones" className="inline-block bg-brand-teal text-white font-bold px-6 py-3 rounded hover:bg-brand-dark transition">
          Ver capacitaciones disponibles
        </Link>
      </main>
    );
  }

  const isClosed = session.status === 'CERRADA' || session.status === 'FINALIZADA';

  if (isClosed) {
    return (
      <main className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-bold text-brand-dark mb-4">Inscripciones cerradas</h1>
        <p className="text-brand-grey mb-8">Las inscripciones para esta sesión de <strong>{course.title}</strong> ya no están disponibles.</p>
        <Link href={`/capacitaciones/${course.slug}`} className="inline-block bg-brand-teal text-white font-bold px-6 py-3 rounded hover:bg-brand-dark transition">
          Ver otras fechas de este curso
        </Link>
      </main>
    );
  }

  const isFull = session.seatsTaken >= session.seatsTotal;

  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-dark mb-3">Ficha de Inscripción</h1>
        <p className="text-lg text-brand-grey">{course.title}</p>
        <p className="text-sm text-brand-grey mt-1">
          {format(new Date(session.startDate), "dd 'de' MMMM yyyy", { locale: es })} · {session.modality.replace('_', ' ')}
          {session.location ? ` · ${session.location}` : ''}
        </p>
        {isFull && (
          <p className="mt-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-2 rounded">
            Los cupos de esta sesión están completos. Tu inscripción quedará en lista de espera.
          </p>
        )}
      </div>

      <EnrollmentForm courseSessionId={session.id} />
    </main>
  );
}
