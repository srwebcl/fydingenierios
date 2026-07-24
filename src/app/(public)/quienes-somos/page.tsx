import React from 'react';

export default function QuienesSomos() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-8 text-center">Quiénes Somos</h1>
      <div className="h-1 w-20 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded mb-12"></div>
      
      <div className="prose prose-lg max-w-none text-brand-grey space-y-6">
        <p className="lead text-xl text-brand-dark font-medium">
          En FYD Ingenieros (Ingeniería en Mantenimiento F&D SpA), somos especialistas en ingeniería de confiabilidad, mantenimiento predictivo y capacitación industrial.
        </p>
        
        <p>
          Nuestro objetivo es garantizar la disponibilidad operativa de los activos críticos de la industria nacional. Entendemos que una detención no programada genera pérdidas millonarias; por ello, nos enfocamos en el diagnóstico temprano y certero utilizando tecnologías de última generación como el análisis de vibraciones, la termografía infrarroja y el alineamiento láser.
        </p>
        
        <h2 className="text-2xl font-bold text-brand-teal mt-12 mb-4">Misión</h2>
        <p>
          Proveer soluciones integrales de ingeniería predictiva y certificación de competencias, entregando a nuestros clientes información precisa y confiable para la toma de decisiones, optimizando la vida útil de sus equipos y reduciendo costos de mantenimiento.
        </p>

        <h2 className="text-2xl font-bold text-brand-teal mt-12 mb-4">Visión</h2>
        <p>
          Ser reconocidos como el socio estratégico líder en Chile en el ámbito de la confiabilidad industrial, destacando por nuestra excelencia técnica, capacidad de respuesta y alto estándar en la formación de profesionales del sector.
        </p>

        <div className="bg-brand-light border-l-4 border-brand-lime p-8 mt-12 rounded-r-lg">
          <h3 className="text-xl font-bold text-brand-dark mb-2">Compromiso Normativo</h3>
          <p className="mb-0">
            Todos nuestros servicios y programas de capacitación están alineados con normativas internacionales vigentes, tales como ISO 18436, ISO 20816, ASME, AWS y API, garantizando resultados auditables y de clase mundial.
          </p>
        </div>
      </div>
    </main>
  );
}
