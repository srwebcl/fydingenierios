import React from 'react';
import { courses } from '@/content/courses';
import { CourseCatalog } from '@/components/capacitaciones/CourseCatalog';

export default function Capacitaciones() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">Catálogo de Capacitaciones</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded mb-6"></div>
        <p className="text-xl text-brand-grey">
          Formación técnica de excelencia con certificación oficial validable para profesionales del mantenimiento y confiabilidad.
        </p>
      </div>

      <CourseCatalog courses={courses} />
    </main>
  );
}
