import React from 'react';
import { getCourseBySlug } from '@/content/courses';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmbeddedLeadForm } from '@/components/forms/EmbeddedLeadForm';
import { FAQAccordion } from '@/components/capacitaciones/FAQAccordion';
import { Calendar, MapPin, Clock, Award, BookOpen, QrCode } from 'lucide-react';

export default async function CapacitacionIndividual({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Obtener sesiones abiertas
  const sessions = await prisma.courseSession.findMany({
    where: { 
      courseSlug: slug,
      status: { in: ['ABIERTA', 'CUPOS_LIMITADOS'] }
    },
    orderBy: { startDate: 'asc' }
  });

  return (
    <main>
      {/* Hero Section */}
      <div className="bg-brand-dark text-white py-12 md:py-16 border-b-4 border-brand-teal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-teal/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Breadcrumbs items={[
            { label: 'Capacitaciones', href: '/capacitaciones' },
            { label: course.title }
          ]} />
          
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{course.title}</h1>
            <p className="text-xl md:text-2xl text-brand-light/90 border-l-4 border-brand-teal pl-6 leading-relaxed mb-8">
              {course.shortDescription}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-brand-light font-mono bg-white/5 p-4 rounded-lg inline-flex border border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="text-brand-lime" size={20} />
                <span>{course.durationHours} Horas Cronológicas</span>
              </div>
              {course.includesDiploma && (
                <div className="flex items-center gap-2">
                  <Award className="text-brand-lime" size={20} />
                  <span>Incluye Diploma Oficial QR</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Columna Principal - Contenido */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Próximas Fechas Destacadas */}
            {sessions.length > 0 && (
              <section className="bg-brand-light border border-brand-teal/20 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <Calendar className="text-brand-teal" /> Fechas Disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map(s => {
                    const cupos = s.seatsTotal - s.seatsTaken;
                    const agotado = cupos <= 0;
                    return (
                      <div key={s.id} className="bg-white p-5 rounded border border-brand-grey/20 shadow-sm relative overflow-hidden">
                        {agotado && <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">Agotado</div>}
                        {!agotado && cupos <= 3 && <div className="absolute top-0 right-0 bg-brand-lime text-brand-dark text-[10px] font-bold px-3 py-1 uppercase tracking-wider">Últimos {cupos} cupos</div>}
                        
                        <p className="font-bold text-lg text-brand-dark mb-2">{s.startDate.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <div className="flex items-center text-sm text-brand-grey mb-1">
                          <MapPin size={16} className="mr-2" /> {s.modality.replace('_', ' ')} • {s.location}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="prose prose-lg max-w-none text-brand-grey">
              <h2 className="text-3xl font-bold text-brand-dark border-b border-brand-light pb-4">Acerca de este curso</h2>
              <p className="leading-relaxed">{course.fullDescription}</p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Dirigido a</h2>
              <div className="bg-brand-white border border-brand-light p-6 rounded-lg shadow-sm">
                <p className="text-brand-grey leading-relaxed m-0">Ingenieros de planta, técnicos de mantenimiento, supervisores y personal encargado de la confiabilidad de los equipos mecánicos o eléctricos de la empresa. Ideal para quienes buscan formalizar conocimientos y obtener certificación oficial.</p>
              </div>
            </section>

            {/* Temario (Syllabus) */}
            {course.syllabus && course.syllabus.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4 flex items-center gap-2">
                  <BookOpen className="text-brand-teal" /> Plan de Estudios
                </h2>
                <div className="space-y-6">
                  {course.syllabus.map((module, i) => (
                    <div key={i} className="bg-brand-white border border-brand-light rounded-xl p-6">
                      <h3 className="font-bold text-xl text-brand-dark mb-4">{module.title}</h3>
                      <ul className="space-y-3">
                        {module.topics.map((topic, j) => (
                          <li key={j} className="flex items-start text-brand-grey">
                            <span className="w-1.5 h-1.5 bg-brand-teal rounded-full mt-2.5 mr-3 shrink-0"></span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certificación Oficial */}
            {course.includesDiploma && (
              <section className="bg-brand-dark text-white p-8 rounded-xl flex flex-col md:flex-row items-center gap-8 shadow-xl">
                <div className="bg-white p-4 rounded-lg shrink-0 flex items-center justify-center">
                  <QrCode size={80} className="text-brand-dark" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-brand-lime">Certificación Oficial Vía QR</h3>
                  <p className="text-brand-light/80 leading-relaxed m-0">
                    Al aprobar esta capacitación, recibirás un diploma digital emitido bajo el Motor de Credenciales FYD. 
                    Este diploma incluye un código QR único que permite a empleadores, mandantes o jefes de turno validar tu competencia 
                    instantáneamente en nuestro portal público.
                  </p>
                </div>
              </section>
            )}

            {/* FAQs */}
            {course.faqs && course.faqs.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Preguntas Frecuentes</h2>
                <FAQAccordion faqs={course.faqs} />
              </section>
            )}

          </div>
          
          {/* Columna Lateral - Conversión Directa */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <EmbeddedLeadForm 
                interestType="CAPACITACION"
                interestSlug={course.slug}
                title={sessions.length > 0 ? "Inscribirse / Cotizar Curso" : "Cotizar Curso Cerrado"}
                subtitle={sessions.length > 0 ? "Asegure su cupo completando el formulario. Le enviaremos el programa detallado y medios de pago." : "Actualmente no hay fechas abiertas. Cotice este programa en modalidad In-Company para su empresa."}
              />
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
