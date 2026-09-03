import React from 'react';
import Link from 'next/link';
import { prisma as db } from '@/lib/db';
import { HeroVideoBackground } from '@/components/home/HeroVideoBackground';
import { StepByStepContactForm } from '@/components/forms/StepByStepContactForm';
import { Factory, Zap, Droplets, HardHat, CheckCircle2, QrCode, TrendingUp, FileCheck } from 'lucide-react';

export default async function Home() {
  const [servicesData, coursesData] = await Promise.all([
    db.service.findMany({ select: { title: true } }),
    db.course.findMany({ select: { title: true } })
  ]);
  
  const servicesList = servicesData.map(s => s.title);
  const coursesList = coursesData.map(c => c.title);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 border-b border-brand-grey/20 overflow-hidden">
        <HeroVideoBackground />
        <div className="container mx-auto px-6 sm:px-4 text-center max-w-4xl relative z-10">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-teal pb-2 inline-block">
              Mantenimiento Predictivo
            </span> <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>y Centro de Especialización
          </h1>
          <p className="text-lg sm:text-xl text-brand-light/90 mb-10 leading-relaxed font-sans px-2 sm:px-0">
            Garantizamos la disponibilidad de sus activos críticos mediante tecnología de diagnóstico avanzado, servicios de certificación y capacitación especializada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/servicios" className="bg-brand-teal text-white px-8 py-4 rounded font-bold hover:bg-brand-dark transition shadow-lg">
              Conocer Servicios
            </Link>
            <Link href="#contacto" className="bg-brand-white text-brand-teal border-2 border-brand-teal px-8 py-4 rounded font-bold hover:bg-brand-light transition">
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </section>

      {/* Industrias (Nuevo) */}
      <section className="py-12 bg-white border-b border-brand-light">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-brand-grey font-bold tracking-widest uppercase text-sm mb-8">Industrias que se benefician con F&D Ingeniería</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="flex items-center gap-2 text-brand-dark font-bold text-lg"><HardHat size={28} className="text-brand-teal" /> Minería</div>
            <div className="flex items-center gap-2 text-brand-dark font-bold text-lg"><Zap size={28} className="text-brand-teal" /> Energía</div>
            <div className="flex items-center gap-2 text-brand-dark font-bold text-lg"><Droplets size={28} className="text-brand-teal" /> Celulosa y Papel</div>
            <div className="flex items-center gap-2 text-brand-dark font-bold text-lg"><Factory size={28} className="text-brand-teal" /> Manufactura</div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-brand-dark mb-4">Soluciones Integrales</h2>
            <p className="text-lg text-brand-grey max-w-2xl mx-auto">Un ecosistema de servicios diseñado para maximizar el ciclo de vida de sus activos industriales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-brand-white p-8 rounded-xl border border-brand-grey/10 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-6 text-brand-teal group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-brand-dark">Servicios de mantenimiento predictivo y confiabilidad</h3>
              <p className="text-brand-grey mb-6">Análisis de vibraciones, termografía, alineamiento láser, auditorías y estudios RCM para asegurar la disponibilidad de sus activos críticos.</p>
              <Link href="/servicios" className="text-brand-teal font-bold hover:underline">Ver detalles &rarr;</Link>
            </div>

            <div className="bg-brand-white p-8 rounded-xl border border-brand-grey/10 hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-6 text-brand-teal group-hover:scale-110 transition">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-brand-dark">Centro de Especialización</h3>
              <p className="text-brand-grey mb-6">Capacitación técnica especializada en mantenimiento predictivo, con certificados verificables en línea, programas actualizados y enfoque práctico para la industria.</p>
              <Link href="/capacitaciones" className="text-brand-teal font-bold hover:underline">Ver cursos impartidos &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué Elegir F&D (Propuesta de Valor) */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold mb-6">Por qué confiar en <span className="text-brand-teal">F&D Ingeniería</span></h2>
              <p className="text-brand-light/80 text-lg leading-relaxed mb-8">
                Nuestra experiencia en terreno nos permite entregar diagnósticos precisos y soluciones efectivas. No solo detectamos el problema, sino que acompañamos a su equipo en la mitigación de fallas.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-brand-teal/20 rounded flex items-center justify-center shrink-0 mr-4">
                    <CheckCircle2 className="text-brand-teal" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Expertise Certificado</h4>
                    <p className="text-brand-light/70 text-sm">Nuestro equipo está calificado bajo normas internacionales (ISO, AWS, ASME).</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-brand-teal/20 rounded flex items-center justify-center shrink-0 mr-4">
                    <QrCode className="text-brand-teal" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Trazabilidad Total</h4>
                    <p className="text-brand-light/70 text-sm">Informes y certificados verificables mediante código QR en nuestra plataforma.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-brand-teal/20 rounded flex items-center justify-center shrink-0 mr-4">
                    <TrendingUp className="text-brand-teal" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Enfoque en Resultados</h4>
                    <p className="text-brand-light/70 text-sm">Reducción comprobable de paradas no programadas y costos de mantenimiento.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validar Credencial (Call to Action integrado) */}
            <div className="relative bg-white p-10 sm:p-12 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-lime/20 rounded-bl-full z-0"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-brand-teal text-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <QrCode size={32} />
                </div>
                <h3 className="font-heading text-3xl font-bold mb-4 text-brand-dark">Plataforma de Validaciones</h3>
                <p className="text-brand-grey mb-8 text-lg">
                  Como Mandante o Jefe de Planta, usted puede verificar instantáneamente la autenticidad de los informes técnicos emitidos o las certificaciones de capacitación de su personal.
                </p>
                <Link href="/certificados" className="inline-flex items-center text-brand-teal font-bold hover:text-brand-dark transition-colors border-b-2 border-brand-teal pb-1 text-lg">
                  Acceder al Motor de Validaciones &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario Paso a Paso */}
      <section id="contacto" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-brand-dark mb-4">Inicie su Cotización</h2>
            <p className="text-lg text-brand-grey">Complete el asistente para derivar su requerimiento al área correcta.</p>
          </div>

          <StepByStepContactForm servicesList={servicesList} coursesList={coursesList} />

          {/* Info de Apoyo */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center border-t border-brand-light pt-12">
            <div>
              <div className="w-12 h-12 bg-brand-light text-brand-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h4 className="font-bold text-brand-dark mb-1">Teléfono Directo</h4>
              <p className="text-brand-grey">+56 9 8389 4138</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-light text-brand-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-bold text-brand-dark mb-1">Correo Electrónico</h4>
              <p className="text-brand-grey">beatriz.rain@fydingenieria.cl</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-light text-brand-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 className="font-bold text-brand-dark mb-1">Sede Principal</h4>
              <p className="text-brand-grey">Rancagua, Región de O'Higgins</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
