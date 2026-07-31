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

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-light p-8 rounded-xl shadow-md border-t-4 border-brand-teal hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-2">
            <span className="text-brand-teal text-3xl">🎯</span> Misión
          </h2>
          <p className="text-brand-grey leading-relaxed">
            Contribuir al desarrollo de la industria mediante soluciones especializadas en ingeniería de mantenimiento, monitoreo de condición y capacitación técnica, entregando servicios de alta calidad, respaldados por la experiencia, la innovación y un firme compromiso con la confiabilidad, la seguridad y el desarrollo de competencias de nuestros clientes.
          </p>
        </div>

        <div className="bg-brand-light p-8 rounded-xl shadow-md border-t-4 border-brand-lime hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-2">
            <span className="text-brand-lime text-3xl">👁️</span> Visión
          </h2>
          <p className="text-brand-grey leading-relaxed">
            Ser una empresa referente en Chile y Latinoamérica en ingeniería de mantenimiento y formación técnica especializada, reconocida por la excelencia de nuestros servicios, la calidad de nuestras capacitaciones y la capacidad de generar valor para la industria a través de la innovación, el conocimiento y la mejora continua.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-brand-dark mb-3">Nuestros Valores</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Excelencia Técnica', desc: 'Trabajamos con altos estándares profesionales, aplicando conocimientos especializados, metodologías reconocidas y buenas prácticas para entregar soluciones confiables y de calidad.' },
            { title: 'Integridad', desc: 'Actuamos con honestidad, transparencia y ética en cada proyecto, construyendo relaciones de confianza con nuestros clientes, colaboradores y aliados.' },
            { title: 'Compromiso', desc: 'Asumimos cada desafío con responsabilidad y dedicación, orientando nuestro trabajo al cumplimiento de los objetivos y a la satisfacción de nuestros clientes.' },
            { title: 'Innovación', desc: 'Impulsamos la mejora continua mediante la incorporación de nuevas tecnologías, metodologías y herramientas que aporten valor a la industria.' },
            { title: 'Seguridad', desc: 'Promovemos una cultura de trabajo seguro, priorizando la protección de las personas y el cumplimiento de las normas de seguridad en todas nuestras actividades.' },
            { title: 'Desarrollo de Competencias', desc: 'Creemos en el aprendizaje continuo como motor del crecimiento profesional, fomentando la formación técnica y la transferencia de conocimiento para fortalecer las capacidades de las personas y las organizaciones.' }
          ].map((valor, idx) => (
            <div key={idx} className="bg-white border border-brand-light p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-bold text-brand-teal mb-3">{valor.title}</h3>
              <p className="text-brand-grey text-sm leading-relaxed">{valor.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
