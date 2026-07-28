import React from 'react';
import { courses } from '@/content/courses';
import { CourseCatalog } from '@/components/capacitaciones/CourseCatalog';

export default function Capacitaciones() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">Academia F&D Ingeniería</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded mb-6"></div>
        <p className="text-xl text-brand-grey">
          Capacitación especializada para profesionales del mantenimiento predictivo y la confiabilidad de activos.
        </p>
      </div>

      <CourseCatalog courses={courses} />

      <div className="bg-brand-dark text-brand-light rounded-xl p-8 mt-16 max-w-4xl mx-auto shadow-lg text-center border-t-4 border-brand-teal">
        <h2 className="text-2xl font-bold mb-4 text-white">¿Por qué capacitarse con F&D?</h2>
        <p className="text-lg leading-relaxed text-brand-light/90">
          Nuestros programas de capacitación combinan fundamentos teóricos, aplicación práctica en equipos reales y estudio de casos industriales, permitiendo a los participantes desarrollar competencias aplicables inmediatamente en terreno.
        </p>
      </div>
    </main>
  );
}
