import React from 'react';
import Image from 'next/image';

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

      {/* NUESTRO EQUIPO */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-brand-dark mb-3">Nuestro Equipo</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded"></div>
          <p className="mt-6 text-brand-grey text-lg max-w-3xl mx-auto leading-relaxed">
            F&D Ingeniería está liderada por profesionales con experiencia en mantenimiento industrial, confiabilidad de activos, gestión empresarial y desarrollo comercial. Nuestro equipo combina conocimientos técnicos, experiencia en terreno y una visión orientada a entregar soluciones confiables y de alto valor para la industria.
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {/* Alamiro */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-brand-light/30 p-8 rounded-2xl">
            <div className="w-48 h-64 md:w-56 md:h-72 shrink-0 relative rounded-2xl overflow-hidden shadow-lg">
              <Image src="/alamiro-fernandez.jpeg" alt="Alamiro Fernández Huenuqueo" fill className="object-cover object-top" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-brand-dark">Alamiro Fernández Huenuqueo</h3>
              <p className="text-brand-teal font-medium text-lg mb-4">Socio fundador y gerente general</p>
              <p className="text-brand-grey leading-relaxed text-left">
                Ingeniero Civil Industrial, Magíster en Gestión de Organizaciones y especialista en mantenimiento predictivo y confiabilidad de activos. Analista de Vibraciones ISO 18436-2 Categoría IV, con experiencia en diagnóstico de maquinaria, monitoreo de condición, gestión de contratos y formación técnica especializada para la industria.
              </p>
            </div>
          </div>

          {/* Daniel */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-brand-white p-8 rounded-2xl border border-brand-light shadow-sm">
            <div className="w-48 h-64 md:w-56 md:h-72 shrink-0 relative rounded-2xl overflow-hidden shadow-lg">
              <Image src="/daniel-dinamarca.jpeg" alt="Daniel Dinamarca" fill className="object-cover object-top" />
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold text-brand-dark">Daniel Dinamarca</h3>
              <p className="text-brand-teal font-medium text-lg mb-4">Socio fundador y gerente comercial</p>
              <p className="text-brand-grey leading-relaxed text-left md:text-right">
                Ingeniero Civil Industrial y Diplomado en Excelencia Operacional y Gestión de Activos. Cuenta con experiencia en gestión comercial, desarrollo de negocios y generación de soluciones orientadas a las necesidades de los clientes, contribuyendo al posicionamiento y crecimiento de F&D Ingeniería.
              </p>
            </div>
          </div>

          {/* Beatriz */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-brand-light/30 p-8 rounded-2xl">
            <div className="w-48 h-64 md:w-56 md:h-72 shrink-0 relative rounded-2xl overflow-hidden shadow-lg">
              <Image src="/beatriz-rain.jpeg" alt="Beatriz Rain" fill className="object-cover object-top" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-brand-dark">Beatriz Rain</h3>
              <p className="text-brand-teal font-medium text-lg mb-4">Secretaria Administrativa de Servicios y Capacitaciones</p>
              <p className="text-brand-grey leading-relaxed text-left">
                Responsable del apoyo administrativo, atención de clientes y coordinación de solicitudes relacionadas con los servicios y capacitaciones de F&D Ingeniería. Gestiona consultas, inscripciones y seguimiento comercial, facilitando una atención ordenada y oportuna.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
