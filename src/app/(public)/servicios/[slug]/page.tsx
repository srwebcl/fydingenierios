import React from 'react';
import Image from 'next/image';
import { prisma as db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmbeddedLeadForm } from '@/components/forms/EmbeddedLeadForm';
import { CheckCircle2 } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await db.service.findMany({ select: { slug: true } });
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicioIndividual({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });

  if (!service) {
    notFound();
  }

  const localImagePath = path.join(process.cwd(), 'public', 'images', 'services', `${service.slug}.jpg`);
  const hasLocalImage = fs.existsSync(localImagePath);
  const displayImage = service.imageUrl || (hasLocalImage ? `/images/services/${service.slug}.jpg` : null);

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-brand-dark text-white py-12 md:py-16 border-b-4 border-brand-teal relative overflow-hidden">
        {displayImage && (
          <Image 
            src={displayImage}
            alt={service.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-teal/30 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Breadcrumbs items={[
            { label: 'Servicios', href: '/servicios' },
            { label: service.title }
          ]} />
          
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{service.title}</h1>
            <p className="text-xl md:text-2xl text-brand-light/90 border-l-4 border-brand-teal pl-6 leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Columna Principal - Contenido */}
          <div className="lg:col-span-2 space-y-12">
            <section className="prose prose-lg max-w-none text-brand-grey">
              <h2 className="text-3xl font-bold text-brand-dark border-b border-brand-light pb-4">Descripción General</h2>
              <p className="leading-relaxed whitespace-pre-line">{service.fullDescription}</p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Beneficios del Servicio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start bg-brand-light p-4 rounded-lg">
                    <CheckCircle2 className="text-brand-lime shrink-0 mr-3 mt-1" size={24} />
                    <span className="text-brand-dark font-medium leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Entregables</h2>
              <ul className="space-y-4">
                {service.deliverables.map((item, i) => (
                  <li key={i} className="flex items-center text-brand-grey text-lg">
                    <span className="w-2 h-2 bg-brand-teal rounded-full mr-4 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="bg-brand-dark text-white p-8 rounded-xl mt-12 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Compromiso Normativo</h3>
                {service.normatives && service.normatives.length > 0 ? (
                  <ul className="text-brand-light/80 m-0 space-y-1 list-disc list-inside">
                    {service.normatives.map((norma, i) => (
                      <li key={i}>{norma}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-brand-light/80 m-0">Trabajamos bajo los más altos estándares internacionales.</p>
                )}
              </div>
              <div className="mt-6 md:mt-0">
                <svg className="w-16 h-16 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
            </div>
          </div>
          
          {/* Columna Lateral - Conversión Directa */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <EmbeddedLeadForm 
                interestType="SERVICIO"
                interestSlug={service.slug}
                interestName={service.title}
                title="Cotizar este servicio"
                subtitle="Complete los datos y un ingeniero se pondrá en contacto para evaluar su requerimiento técnico."
              />
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
