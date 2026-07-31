import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import CourseWizard from '@/components/admin/CourseWizard';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editar Curso | F&D Admin',
};

export default async function EditarCursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const course = await prisma.course.findUnique({
    where: { slug }
  });

  if (!course) {
    notFound();
  }

  const options = await prisma.courseOption.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark">Editar Curso: {course.title}</h1>
          <p className="text-brand-grey text-sm mt-1">Actualiza la información del curso.</p>
        </div>
        <Link href="/admin-panel/capacitaciones" className="text-sm text-brand-teal hover:underline font-bold">
          &larr; Volver
        </Link>
      </div>

      <CourseWizard initialData={course as any} isEditing options={options} />
    </div>
  );
}
