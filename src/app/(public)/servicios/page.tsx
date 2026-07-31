import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma as db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function Servicios() {
  const services = await db.service.findMany({
    orderBy: { createdAt: 'asc' }
  });
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
        {services.map(service => {
          const localImagePath = path.join(process.cwd(), 'public', 'images', 'services', `${service.slug}.jpg`);
          const hasLocalImage = fs.existsSync(localImagePath);
          
          const displayImage = service.imageUrl || (hasLocalImage ? `/images/services/${service.slug}.jpg` : null);

          return (
            <div key={service.slug} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[350px]">
              {/* Background Image */}
              {displayImage ? (
                <Image 
                  src={displayImage} 
                  alt={service.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-brand-dark"></div>
              )}
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/30"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                <h2 className="text-2xl font-bold text-white mb-3">{service.title}</h2>
                <p className="text-brand-light/90 mb-6 leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>
                <Link href={`/servicios/${service.slug}`} className="text-brand-teal font-bold hover:text-white flex items-center transition w-max">
                  Conocer más detalle <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
