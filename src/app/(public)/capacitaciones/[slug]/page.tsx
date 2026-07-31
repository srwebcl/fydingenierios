import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmbeddedLeadForm } from '@/components/forms/EmbeddedLeadForm';
import { FAQAccordion } from '@/components/capacitaciones/FAQAccordion';
import { Calendar, MapPin, Clock, Award, BookOpen, QrCode } from 'lucide-react';
import { UpcomingDatesCarousel } from '@/components/capacitaciones/UpcomingDatesCarousel';

export const dynamicParams = true;

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ select: { slug: true } });
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CapacitacionIndividual({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });

  if (!course) {
    notFound();
  }

  // Obtener sesiones abiertas
  let sessions: any[] = [];
  try {
    sessions = await prisma.courseSession.findMany({
      where: { 
        courseSlug: slug,
        status: { in: ['ABIERTA', 'CUPOS_LIMITADOS'] }
      },
      orderBy: { startDate: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching course sessions:", error);
    // Silent fail for static generation or missing DB
  }

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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Columna Principal - Contenido */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Se movieron las fechas al sidebar derecho */}

            <section className="prose prose-lg max-w-none text-brand-grey">
              <h2 className="text-3xl font-bold text-brand-dark border-b border-brand-light pb-4">Acerca de este curso</h2>
              <p className="leading-relaxed whitespace-pre-line">{course.fullDescription}</p>
            </section>

            {course.whatYouWillLearn && course.whatYouWillLearn.filter(item => item.trim().length > 0).length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">¿Qué aprenderás?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.filter(item => item.trim().length > 0).map((item, i) => (
                    <div key={i} className="flex items-start bg-brand-light p-4 rounded-lg shadow-sm border border-brand-teal/10">
                      <span className="w-2 h-2 bg-brand-teal rounded-full mt-2.5 mr-3 shrink-0"></span>
                      <span className="text-brand-dark font-medium leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Información General</h2>
              <div className="bg-brand-white border border-brand-light rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-sm">
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Duración</h4>
                  <p className="text-brand-grey m-0">{course.durationHours} horas</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Modalidad</h4>
                  <p className="text-brand-grey m-0">{course.modality || 'Presencial / Online'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Nivel</h4>
                  <p className="text-brand-grey m-0">{course.level}</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Evaluación</h4>
                  <p className="text-brand-grey m-0">{course.evaluation || 'Teórica y práctica'}</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="font-bold text-brand-dark mb-1">Material</h4>
                  <p className="text-brand-grey m-0">{course.material || 'Manual y material complementario'}</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="font-bold text-brand-dark mb-1">Certificación</h4>
                  <p className="text-brand-grey m-0">{course.certificationText || 'Certificado Oficial'}</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Dirigido a</h2>
              <div className="bg-brand-white border border-brand-light p-6 rounded-lg shadow-sm">
                <p className="text-brand-grey leading-relaxed m-0">{course.audience || 'Ingenieros de planta, técnicos de mantenimiento, supervisores y personal encargado de la confiabilidad de los equipos mecánicos o eléctricos de la empresa. Ideal para quienes buscan formalizar conocimientos y obtener certificación oficial.'}</p>
              </div>
            </section>

            {/* Temario (Syllabus) */}
            {course.syllabus && (course.syllabus as any[]).length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4 flex items-center gap-2">
                  <BookOpen className="text-brand-teal" /> Plan de Estudios
                </h2>
                <div className="space-y-6">
                  {(course.syllabus as { title: string, topics: string[] }[]).map((module, i) => (
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

            {course.whyChooseUs && course.whyChooseUs.filter(item => item.trim().length > 0).length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">¿Por qué elegir este curso?</h2>
                <ul className="space-y-4 bg-brand-white border border-brand-light rounded-xl p-6 shadow-sm">
                  {course.whyChooseUs.filter(item => item.trim().length > 0).map((item, i) => (
                    <li key={i} className="flex items-center text-brand-grey text-lg">
                      <span className="text-brand-teal font-bold mr-3 shrink-0 text-xl">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.instructorName && (
              <section className="bg-brand-light rounded-xl p-8 border-l-4 border-brand-teal shadow-sm">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Instructor Principal</h2>
                <h3 className="text-xl font-bold text-brand-teal mb-1">{course.instructorName}</h3>
                <p className="text-brand-grey font-medium mb-4">{course.instructorTitle}</p>
                <p className="text-brand-dark/80 leading-relaxed m-0 text-sm">{course.instructorDesc}</p>
              </section>
            )}

            {/* Certificación Oficial */}
            {course.includesDiploma && (
              <section className="bg-brand-dark text-white p-8 rounded-xl flex flex-col md:flex-row items-start gap-8 shadow-xl">
                <div className="bg-white p-4 rounded-lg shrink-0 flex items-center justify-center mt-2">
                  <QrCode size={60} className="text-brand-dark" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-brand-lime">Certificación</h3>
                  <p className="text-brand-light/90 leading-relaxed m-0 mb-4">
                    Al aprobar el curso, los participantes recibirán un Certificado de Aprobación emitido por F&D Ingeniería, el cual incorpora un código único y un código QR para su verificación en línea.
                  </p>
                  <p className="text-brand-light/60 text-xs leading-relaxed m-0 italic border-l-2 border-brand-light/30 pl-3">
                    Importante: Este programa ha sido desarrollado considerando los lineamientos y competencias establecidos en normas internacionales aplicables y las mejores prácticas de la industria. El certificado emitido por F&D Ingeniería acredita la aprobación del curso impartido por nuestra institución y no constituye una certificación internacional de competencias otorgada por un organismo acreditado.
                  </p>
                </div>
              </section>
            )}

            {/* FAQs */}
            {course.faqs && (course.faqs as any[]).length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 border-b border-brand-light pb-4">Preguntas Frecuentes</h2>
                <FAQAccordion faqs={course.faqs as {question: string, answer: string}[]} />
              </section>
            )}

          </div>
          
          {/* Columna Lateral - Conversión Directa */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-brand-teal text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center">Próximas Fechas</h3>
                
                {sessions.length > 0 ? (
                  <UpcomingDatesCarousel sessions={sessions} />
                ) : (
                  <>
                    <p className="text-sm text-brand-light/90 mb-4 text-center">Consulta nuestras próximas convocatorias o solicita una capacitación exclusiva para tu empresa.</p>
                    <a href="#contacto" className="block w-full bg-white text-brand-teal font-bold py-3 rounded-lg text-sm hover:bg-brand-light transition text-center">
                      Solicitar Información
                    </a>
                  </>
                )}
              </div>

              <EmbeddedLeadForm 
                interestType="CAPACITACION"
                interestSlug={course.slug}
                title={sessions.length > 0 ? "Inscribirse / Cotizar Curso" : "Cotizar Curso Cerrado"}
                subtitle={sessions.length > 0 ? "Asegure su cupo completando el formulario. Le enviaremos el programa detallado y medios de pago." : "Desarrollamos programas In Company, adaptando los contenidos, horarios y actividades prácticas a las necesidades específicas de cada organización."}
              />
              
              {course.pdfUrl && (
                <div className="bg-brand-light border border-brand-teal/20 rounded-xl p-6 text-center shadow-sm">
                  <h3 className="font-bold text-brand-dark mb-3">Programa del Curso</h3>
                  <a 
                    href={course.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2 bg-brand-dark text-white font-bold px-4 py-3 rounded hover:bg-brand-teal transition"
                  >
                    <BookOpen size={18} />
                    Descargar Programa (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
