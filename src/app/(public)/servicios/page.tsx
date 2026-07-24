import React from 'react';
import Link from 'next/link';
import { services } from '@/content/services';

export default function Servicios() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">Servicios Especializados</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-brand-lime to-brand-teal mx-auto rounded mb-6"></div>
        <p className="text-xl text-brand-grey max-w-2xl mx-auto">
          Diagnóstico predictivo y certificación de competencias para la gran industria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map(service => (
          <div key={service.slug} className="bg-brand-white border border-brand-light rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full">
            <div className="p-8 flex-1">
              <h2 className="text-2xl font-bold text-brand-dark mb-3">{service.title}</h2>
              <p className="text-brand-grey mb-6 leading-relaxed">
                {service.shortDescription}
              </p>
            </div>
            <div className="px-8 py-6 bg-brand-light/50 border-t border-brand-light mt-auto">
              <Link href={`/servicios/${service.slug}`} className="text-brand-teal font-bold hover:text-brand-dark flex items-center transition">
                Conocer más detalle <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
