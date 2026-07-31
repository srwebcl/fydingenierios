import React from 'react';
import { Metadata } from 'next';
import CourseWizard from '@/components/admin/CourseWizard';
import { prisma as db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Crear Curso | F&D Admin',
};

export default async function NuevoCursoPage() {
  const options = await db.courseOption.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Crear Nuevo Curso</h2>
        <p className="text-brand-grey text-sm mt-1">Completa los pasos para publicar un nuevo curso en el sitio web.</p>
      </div>

      <CourseWizard options={options} />
    </div>
  );
}
