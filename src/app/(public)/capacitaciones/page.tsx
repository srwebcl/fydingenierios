import React from 'react';
import { prisma as db } from '@/lib/db';
import { CourseCatalog } from '@/components/capacitaciones/CourseCatalog';

export const dynamic = 'force-dynamic';

export default async function Capacitaciones() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: 'asc' }
  });
  return (
    <main className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">Academia F&D Ingeniería</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded mb-6"></div>
        <p className="text-xl text-brand-grey leading-relaxed">
          Potenciamos el desarrollo profesional a través de programas de capacitación diseñados para personas y empresas, combinando conocimientos teóricos, aplicación práctica y casos reales para fortalecer las competencias técnicas y mejorar el desempeño en la industria.
        </p>
      </div>

      <CourseCatalog courses={courses} />

      <div className="mt-16 bg-white rounded-xl shadow p-8 max-w-4xl mx-auto border-t-4 border-brand-lime">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark">Modalidades de capacitación:</h2>
        <ul className="space-y-4 text-brand-grey text-lg">
          <li className="flex items-start">
            <span className="text-brand-teal font-bold mr-3">•</span>
            <span><strong>Cursos abiertos:</strong> Para profesionales y técnicos que desean capacitarse de forma individual.</span>
          </li>
          <li className="flex items-start">
            <span className="text-brand-teal font-bold mr-3">•</span>
            <span><strong>Capacitaciones corporativas:</strong> Programas exclusivos para empresas y grupos cerrados.</span>
          </li>
          <li className="flex items-start">
            <span className="text-brand-teal font-bold mr-3">•</span>
            <span><strong>Capacitaciones a medida:</strong> Contenidos adaptados a los requerimientos y objetivos de cada organización.</span>
          </li>
          <li className="flex items-start">
            <span className="text-brand-teal font-bold mr-3">•</span>
            <span><strong>Presencial u online en vivo:</strong> Nos adaptamos a la modalidad que mejor se ajuste a las necesidades de nuestros clientes.</span>
          </li>
        </ul>
      </div>

      <div className="bg-brand-dark text-brand-light rounded-xl p-8 mt-12 max-w-4xl mx-auto shadow-lg text-center border-t-4 border-brand-teal">
        <h2 className="text-2xl font-bold mb-4 text-white">¿Por qué capacitarse con F&D?</h2>
        <p className="text-lg leading-relaxed text-brand-light/90">
          Nuestros programas de capacitación combinan fundamentos teóricos, aplicación práctica en equipos reales y estudio de casos industriales, permitiendo a los participantes desarrollar competencias aplicables inmediatamente en terreno.
        </p>
      </div>
    </main>
  );
}
