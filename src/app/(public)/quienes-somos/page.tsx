import React from 'react';

export default function QuienesSomos() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-8 text-center">Quiénes Somos</h1>
      <div className="h-1 w-20 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded mb-12"></div>
      
      <div className="prose prose-lg max-w-none text-brand-grey space-y-6">
        <h2 className="text-2xl font-bold text-brand-teal mt-4 mb-4">Ingeniería para la Confiabilidad de Activos Industriales</h2>
        
        <p className="lead text-xl text-brand-dark font-medium leading-relaxed">
          En F&D Ingeniería somos una empresa especializada en mantenimiento predictivo, monitoreo de condición, ingeniería de confiabilidad y capacitación técnica. Nuestro propósito es ayudar a las organizaciones a maximizar la disponibilidad, confiabilidad y vida útil de sus activos mediante soluciones técnicas basadas en las mejores prácticas de la industria.
        </p>
        
        <p className="leading-relaxed">
          Combinamos experiencia en terreno, conocimiento técnico y tecnologías de diagnóstico para entregar información confiable que facilite la toma de decisiones y contribuya a una gestión eficiente del mantenimiento.
        </p>
      </div>
    </main>
  );
}
