import React from 'react';
import { prisma } from '@/lib/db';
import { CredentialStatus, CredentialType } from '@prisma/client';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  User, 
  FileText, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Lock, 
  Database,
  Mail,
  Globe,
  Check,
  AlertCircle,
  XCircle,
  Info
} from 'lucide-react';
import { PrintButton } from '@/components/ui/PrintButton';

type PageProps = {
  searchParams: Promise<{ code?: string, rut?: string }>;
};

const serviceNameMap: Record<string, string> = {
  'analisis-vibraciones': 'Análisis de Vibraciones',
  'termografia-infrarroja': 'Termografía Infrarroja',
  'alineamiento-laser': 'Alineamiento Láser',
  'balanceo-dinamico': 'Balanceo Dinámico',
  'ingenieria-confiabilidad': 'Ingeniería de Confiabilidad y Gestión de Activos',
  'auditorias-tecnicas': 'Auditorías Técnicas de Mantenimiento Predictivo',
  'implementacion-programas': 'Implementación de Programas de Mantenimiento Predictivo',
  'asesorias-ingenieria': 'Asesorías e Ingeniería Especializada'
};

export default async function CertificadosPage({ searchParams }: PageProps) {
  const { code } = await searchParams;

  // 1. Vista Principal (Formularios de ingreso)
  if (!code) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold mb-4 text-brand-teal">Portal de Certificados</h1>
          <p className="text-brand-grey">Valide la autenticidad de informes técnicos de servicio o diplomas de capacitación.</p>
        </div>

        <div className="bg-brand-white p-8 rounded-xl shadow-lg border border-brand-light mb-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4 text-brand-dark border-b border-brand-light pb-2">Validar Certificado / Informe</h2>
          <form action={async (formData) => {
            'use server';
            const code = formData.get('code') as string;
            if (code) redirect(`/certificados?code=${code.trim().toUpperCase()}`);
          }} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              name="code" 
              placeholder="Ej. A1B2C3D4" 
              className="flex-1 border border-brand-grey/30 rounded p-3 uppercase font-mono"
              required
              autoFocus
            />
            <button type="submit" className="bg-brand-teal text-white px-6 py-3 rounded font-bold hover:bg-brand-dark transition-colors">
              Validar
            </button>
          </form>
        </div>

        <div className="bg-brand-light/50 p-8 rounded-xl border border-brand-light text-center w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4 text-brand-dark pb-2">¿Perdió su Certificado o Informe?</h2>
          <p className="text-sm text-brand-grey mb-6">
            Si no encuentra su documento, puede solicitar una copia digital sin costo escribiendo a nuestro correo oficial.
          </p>
          <a href="mailto:contacto@fydingenieria.cl" className="inline-block bg-brand-dark text-white px-8 py-3 rounded font-bold hover:bg-brand-teal transition-colors shadow-md">
            Solicitar a contacto@fydingenieria.cl
          </a>
        </div>
      </main>
    );
  }

  // 2. Vista de Validación de Código
  const cred = await prisma.credential.findUnique({
    where: { validationCode: code },
    include: { holder: true, courseSession: true }
  });

  if (!cred) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="font-heading text-3xl font-bold mb-6 text-brand-teal">Validación de Certificados</h1>
        <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 w-full max-w-2xl text-center shadow-lg">
          <XCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Documento No Encontrado</h2>
          <p>El código ingresado (<span className="font-mono font-bold">{code}</span>) no corresponde a un certificado o informe válido en nuestros registros.</p>
        </div>
        <a href="/certificados" className="mt-8 inline-block text-brand-teal underline font-bold">Volver a buscar</a>
      </main>
    );
  }

  // Dynamic Recalculation of Expiry Status
  let displayStatus = cred.status;
  if (displayStatus === 'VIGENTE' && cred.expiryDate && cred.expiryDate < new Date()) {
    displayStatus = 'EXPIRADO';
  }

  const isDiploma = cred.type === CredentialType.DIPLOMA_CAPACITACION;
  
  // Extraer configuración y curso (si aplica)
  const settings = await prisma.settings.findFirst();
  const contactEmail = settings?.contactEmail || 'contacto@fydingenieria.cl';

  let courseTitle = cred.courseSlug?.replace(/-/g, ' ').toUpperCase() || 'CURSO DE CAPACITACIÓN';
  let certificationText = 'norma ISO 18436 ni por ASNT';
  let courseInstructor = 'Alamiro Andrés Fernández Huenuqueo';
  let courseDuration = '';
  let courseModality = '';

  if (isDiploma && cred.courseSlug) {
    const course = await prisma.course.findUnique({
      where: { slug: cred.courseSlug }
    });
    if (course) {
      courseTitle = course.title;
      if (course.certificationText) certificationText = course.certificationText;
      if (course.instructorName) courseInstructor = course.instructorName;
      if (course.durationHours) courseDuration = `${course.durationHours} horas`;
      if (course.modality) courseModality = course.modality;
    }
  }

  // Configuración de visualización basada en el estado
  const statusConfig = {
    VIGENTE: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CheckCircle2 />,
      title: 'DOCUMENTO AUTÉNTICO',
      subtitle: 'La autenticidad de este certificado ha sido verificada exitosamente en la base de datos de F&D Ingeniería en Mantenimiento.',
      badgeIcon: <ShieldCheck />
    },
    EXPIRADO: {
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: <AlertCircle />,
      title: 'DOCUMENTO EXPIRADO',
      subtitle: 'Este documento es auténtico pero su fecha de vigencia ha expirado según nuestros registros.',
      badgeIcon: <AlertCircle />
    },
    REVOCADO: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <XCircle />,
      title: 'DOCUMENTO REVOCADO',
      subtitle: 'Este documento ha sido revocado y ya no es válido para propósitos oficiales.',
      badgeIcon: <XCircle />
    }
  };

  const config = statusConfig[displayStatus];

  return (
    <main className="min-h-screen bg-gray-100 py-0 sm:py-12 px-0 sm:px-4 flex justify-center print:bg-white print:py-0 font-sans text-brand-dark">
      
      {/* A4 Container */}
      <div className="w-full max-w-5xl bg-white sm:shadow-2xl overflow-hidden print:shadow-none sm:rounded-2xl sm:border border-gray-200">
        
        {/* HEADER */}
        <div className="bg-brand-dark text-white px-4 sm:px-10 py-5 sm:py-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-6 border-b-4 border-brand-teal">
          
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md shrink-0 w-full max-w-[260px] sm:max-w-none flex justify-center">
              <Image src="/logo.jpeg" alt="F&D Ingeniería" width={300} height={100} className="object-contain w-auto h-14 sm:h-20" />
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 bg-white/10 px-4 py-3 sm:py-3.5 rounded-xl border border-white/20 w-full sm:w-auto shadow-inner">
            <ShieldCheck className="text-brand-lime shrink-0 w-8 h-8 sm:w-10 sm:h-10" />
            <div className="text-left w-full">
              <h2 className="text-[11px] sm:text-sm font-black leading-none uppercase tracking-widest text-brand-lime mb-1 sm:mb-1">Validación de Certificados</h2>
              <p className="text-[9px] sm:text-[11px] text-brand-light/90 font-medium leading-tight">Verifica la autenticidad de tu certificado <br className="hidden sm:block"/>o informe técnico oficial F&D.</p>
            </div>
          </div>
        </div>

        {/* MAIN AUTHENTICITY BLOCK */}
        <div className="p-3 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 mb-6 sm:mb-10">
            
            {/* Left Result */}
            <div className="flex-1">
              <div className={`p-4 sm:p-8 rounded-2xl border-2 ${config.borderColor} ${config.bgColor} flex flex-row items-center gap-4 sm:gap-6 relative overflow-hidden h-full text-left shadow-sm`}>
                <div className={`p-2 sm:p-5 rounded-full bg-white shadow-md shrink-0 border border-white/50 z-10`}>
                  {React.cloneElement(config.icon as React.ReactElement<any>, { className: `${config.color} w-8 h-8 sm:w-12 sm:h-12` })}
                </div>
                <div className="z-10 relative flex-1 w-full">
                  <h2 className={`text-[15px] sm:text-3xl font-black uppercase mb-1 sm:mb-2 tracking-tight leading-none ${config.color}`}>{config.title}</h2>
                  <p className="text-brand-dark/80 font-medium leading-tight sm:leading-relaxed max-w-lg text-[11px] sm:text-base">
                    {config.subtitle}
                  </p>
                </div>
                {/* Background watermark */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none hidden sm:block">
                  {React.cloneElement(config.badgeIcon as React.ReactElement<any>, { size: 180, className: config.color })}
                </div>
              </div>
            </div>

            {/* Right Status Badge */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3 sm:gap-4">
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm h-full flex flex-row lg:flex-col">
                <div className="p-3 sm:p-6 flex flex-row gap-3 sm:gap-5 items-center bg-gray-50 flex-1 border-r lg:border-r-0 lg:border-b border-gray-100 text-left">
                  <div className="shrink-0">{React.cloneElement(config.badgeIcon as React.ReactElement<any>, { className: `${config.color} w-6 h-6 sm:w-8 sm:h-8` })}</div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-brand-grey uppercase tracking-wider mb-0.5 sm:mb-1">Estado Actual</p>
                    <p className={`text-[13px] sm:text-xl font-black uppercase tracking-wide leading-none ${config.color}`}>{displayStatus}</p>
                  </div>
                </div>
                <div className="p-3 sm:p-6 flex flex-row gap-3 sm:gap-5 items-center bg-white flex-1 text-left">
                  <Calendar className="text-brand-teal/80 shrink-0 w-6 h-6 sm:w-8 sm:h-8" />
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-brand-grey uppercase tracking-wider mb-0.5 sm:mb-1">Última Verificación</p>
                    <p className="text-[11px] sm:text-sm font-bold text-brand-dark leading-tight">{new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-[9px] sm:text-xs text-brand-grey mt-0.5 sm:mt-1 font-medium">{new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {isDiploma && displayStatus === 'VIGENTE' && (
            <div className="flex items-start sm:items-center gap-3 mb-6 sm:mb-8 text-green-800 bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
              <div className="bg-green-600 rounded-full p-1 text-white shrink-0 mt-0.5 sm:mt-0"><Check size={14} className="sm:hidden"/><Check size={16} className="hidden sm:block"/></div>
              <span className="text-xs sm:text-sm font-semibold leading-snug">El participante completó el programa y aprobó satisfactoriamente las evaluaciones exigidas.</span>
            </div>
          )}

          {/* INFORMATION CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            
            {/* Card 1: Participante / Cliente */}
            <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                <div className="bg-brand-dark p-2 sm:p-2.5 rounded-xl text-white shadow-sm">
                  <User size={16} className="sm:hidden" />
                  <User size={20} className="hidden sm:block" />
                </div>
                <h3 className="font-black text-brand-dark uppercase text-[11px] sm:text-sm tracking-wider">
                  {isDiploma ? 'Información del Participante' : 'Información del Cliente'}
                </h3>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">{isDiploma ? 'Nombre Completo' : 'Empresa Cliente'}</p>
                  <p className="font-bold text-sm sm:text-lg leading-tight text-brand-dark">{isDiploma ? cred.holder.fullName : cred.clientCompany}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">RUT / Identificación Oficial</p>
                  <p className="font-bold text-xs sm:text-base text-brand-dark">{isDiploma ? cred.holder.rut : 'Registrado en Sistema Central'}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Documento */}
            <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                <div className="bg-brand-dark p-2 sm:p-2.5 rounded-xl text-white shadow-sm">
                  <FileText size={16} className="sm:hidden" />
                  <FileText size={20} className="hidden sm:block" />
                </div>
                <h3 className="font-black text-brand-dark uppercase text-[11px] sm:text-sm tracking-wider">Detalles del Documento</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-3 sm:gap-x-4">
                <div className="col-span-2 sm:col-span-2">
                  <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">Clasificación</p>
                  <p className="font-bold text-xs sm:text-sm text-brand-dark">{isDiploma ? 'Certificado de Capacitación' : 'Informe Técnico de Servicio'}</p>
                </div>
                {isDiploma && cred.certificateNumber && (
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">N° Certificado</p>
                    <p className="font-bold text-xs sm:text-sm text-brand-dark">{cred.certificateNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">Código Validación</p>
                  <p className="font-bold text-xs sm:text-sm text-brand-teal font-mono bg-brand-teal/10 px-1.5 sm:px-2 py-0.5 rounded inline-block">{cred.validationCode}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">Fecha Emisión</p>
                  <p className="font-bold text-xs sm:text-sm text-brand-dark">{cred.issueDate.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                {!isDiploma && cred.expiryDate && (
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-brand-grey font-bold uppercase tracking-wider mb-1 sm:mb-1.5">Válido Hasta</p>
                    <p className="font-bold text-xs sm:text-sm text-amber-600">{cred.expiryDate.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Programa / Servicio */}
            <div className="border border-brand-teal/30 rounded-2xl p-5 sm:p-6 bg-brand-teal/5 shadow-sm">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-brand-teal/20">
                <div className="bg-brand-teal p-2 sm:p-2.5 rounded-xl text-white shadow-sm">
                  <GraduationCap size={16} className="sm:hidden" />
                  <GraduationCap size={20} className="hidden sm:block" />
                </div>
                <h3 className="font-black text-brand-teal uppercase text-[11px] sm:text-sm tracking-wider">
                  {isDiploma ? 'Programa de Capacitación' : 'Detalle del Servicio'}
                </h3>
              </div>
              
              <table className="w-full text-xs sm:text-sm">
                <tbody>
                  <tr className="border-b border-brand-teal/10">
                    <td className="py-2.5 sm:py-3 text-brand-dark font-medium w-2/5 sm:w-1/3 flex items-center gap-2 sm:gap-2.5"><BookOpen size={14} className="text-brand-teal shrink-0 sm:hidden"/><BookOpen size={16} className="text-brand-teal shrink-0 hidden sm:block"/> {isDiploma ? 'Curso' : 'Programa'}</td>
                    <td className="py-2.5 sm:py-3 font-bold text-brand-dark">{isDiploma ? courseTitle : (serviceNameMap[cred.serviceSlug as string] || cred.serviceSlug)?.toUpperCase()}</td>
                  </tr>
                  
                  {isDiploma ? (
                    <>
                      {courseDuration && (
                        <tr className="border-b border-brand-teal/10">
                          <td className="py-2.5 sm:py-3 text-brand-dark font-medium flex items-center gap-2 sm:gap-2.5"><Calendar size={14} className="text-brand-teal shrink-0 sm:hidden"/><Calendar size={16} className="text-brand-teal shrink-0 hidden sm:block"/> Duración</td>
                          <td className="py-2.5 sm:py-3 font-bold text-brand-dark">{courseDuration}</td>
                        </tr>
                      )}
                      {courseModality && (
                        <tr className="border-b border-brand-teal/10">
                          <td className="py-2.5 sm:py-3 text-brand-dark font-medium flex items-center gap-2 sm:gap-2.5"><Globe size={14} className="text-brand-teal shrink-0 sm:hidden"/><Globe size={16} className="text-brand-teal shrink-0 hidden sm:block"/> Modalidad</td>
                          <td className="py-2.5 sm:py-3 font-bold text-brand-dark">{courseModality}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2.5 sm:py-3 text-brand-dark font-medium flex items-center gap-2 sm:gap-2.5"><CheckCircle2 size={14} className="text-brand-teal shrink-0 sm:hidden"/><CheckCircle2 size={16} className="text-brand-teal shrink-0 hidden sm:block"/> Resultado</td>
                        <td className="py-2.5 sm:py-3">
                          <span className="bg-brand-teal text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">{cred.approvalType?.toUpperCase() || 'APROBADO'}</span>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b border-brand-teal/10">
                        <td className="py-2.5 sm:py-3 text-brand-dark font-medium flex items-center gap-2 sm:gap-2.5"><FileText size={14} className="text-brand-teal shrink-0 sm:hidden"/><FileText size={16} className="text-brand-teal shrink-0 hidden sm:block"/> Título</td>
                        <td className="py-2.5 sm:py-3 font-bold text-brand-dark">{cred.reportTitle}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 sm:py-3 text-brand-dark font-medium flex items-center gap-2 sm:gap-2.5"><Info size={14} className="text-brand-teal shrink-0 sm:hidden"/><Info size={16} className="text-brand-teal shrink-0 hidden sm:block"/> Equipo</td>
                        <td className="py-2.5 sm:py-3 font-bold text-brand-dark">{cred.equipmentTag || 'N/A'}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Card 4: Organismo y Emisor combinados */}
            <div className="space-y-4 sm:space-y-6 flex flex-col">
              
              {/* Emisor */}
              <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white shadow-sm flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-brand-dark p-1.5 sm:p-2 rounded-lg text-white">
                    <User size={14} className="sm:hidden" />
                    <User size={16} className="hidden sm:block" />
                  </div>
                  <h3 className="font-bold text-brand-dark uppercase text-[10px] sm:text-[11px] tracking-wider">
                    {isDiploma ? 'Instructor Responsable' : 'Ingeniero Responsable'}
                  </h3>
                </div>
                <p className="font-black text-base sm:text-lg text-brand-dark mb-1">{isDiploma ? courseInstructor : 'Ingeniería F&D'}</p>
                <p className="text-[11px] sm:text-xs text-brand-grey font-medium leading-tight">Elaborado y validado por equipo técnico especializado.</p>
              </div>

              {/* Organismo */}
              <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-brand-dark text-white shadow-sm flex-1 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg text-white backdrop-blur-sm">
                      <Building size={14} className="sm:hidden" />
                      <Building size={16} className="hidden sm:block" />
                    </div>
                    <h3 className="font-bold text-brand-teal uppercase text-[10px] sm:text-[11px] tracking-wider">Organismo Emisor</h3>
                  </div>
                  <p className="font-black text-base sm:text-lg mb-0.5">F&D Ingeniería en Mantenimiento</p>
                  <p className="text-[11px] sm:text-xs text-brand-light font-medium mb-4">{isDiploma ? 'Centro de Especialización' : 'División de Servicios y Confiabilidad'}</p>
                  <a href="https://www.fydingenieria.cl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-brand-dark font-bold bg-brand-lime px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white transition-colors">
                    <Globe size={12} className="sm:hidden" />
                    <Globe size={14} className="hidden sm:block" />
                    www.fydingenieria.cl
                  </a>
                </div>
                <Building size={100} className="absolute -right-6 -bottom-6 opacity-5 text-white pointer-events-none sm:w-[120px] sm:h-[120px]" />
              </div>

            </div>

          </div>

          {/* ALCANCE BOX */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-200 p-2 sm:p-2.5 rounded-xl text-brand-dark">
                <BookOpen size={16} className="sm:hidden" />
                <BookOpen size={20} className="hidden sm:block" />
              </div>
              <h3 className="font-black text-brand-dark uppercase text-xs sm:text-sm tracking-wider">Alcance del Documento</h3>
            </div>
            
            {isDiploma ? (
              <div className="text-xs sm:text-sm text-brand-dark/80 space-y-3 sm:space-y-4 md:pl-14 relative z-10 font-medium">
                <p>Este certificado acredita que el participante completó satisfactoriamente el programa de capacitación impartido por <strong className="text-brand-dark">F&D Ingeniería en Mantenimiento</strong>.</p>
                <p>El contenido del programa fue desarrollado considerando los lineamientos técnicos aplicables y las mejores prácticas de la industria.</p>
                <div className="flex gap-3 items-start bg-white p-3 sm:p-4 rounded-xl border border-gray-200 mt-3 sm:mt-4 shadow-sm">
                  <Info size={16} className="shrink-0 mt-0.5 text-brand-teal sm:hidden" />
                  <Info size={18} className="shrink-0 mt-0.5 text-brand-teal hidden sm:block" />
                  <p className="text-[10px] sm:text-xs text-brand-grey leading-relaxed">
                    {certificationText && certificationText.length > 30 
                      ? certificationText.replace(/\{\{fechas\}\}/g, cred.courseDates || 'las fechas indicadas').replace(/\{\{horas\}\}/g, (cred.courseHours || 0).toString())
                      : <>Este documento acredita la realización de la capacitación impartida por F&D Ingeniería en Mantenimiento y <strong className="text-brand-dark">no constituye una certificación internacional de competencia emitida por un organismo certificador acreditado conforme a {certificationText}</strong>.</>
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-brand-dark/80 space-y-3 sm:space-y-4 md:pl-14 relative z-10 font-medium">
                <p>Este documento certifica la autenticidad del informe técnico emitido por <strong className="text-brand-dark">F&D Ingeniería en Mantenimiento</strong>.</p>
                <p>Los resultados y hallazgos detallados en el informe físico o digital original son respaldados por nuestros ingenieros especialistas.</p>
                {cred.findingsSummary && (
                  <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 mt-3 sm:mt-4 shadow-sm">
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-brand-teal tracking-wider mb-1.5 sm:mb-2">Resumen Oficial de Hallazgos:</p>
                    <p className="italic text-brand-dark text-xs sm:text-sm">{cred.findingsSummary}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Background seal watermark effect */}
            <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none">
              <ShieldCheck size={200} className="sm:hidden" />
              <ShieldCheck size={300} className="hidden sm:block" />
            </div>
          </div>

          {/* SECURITY & AUTHENTICITY BAR */}
          <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white grid grid-cols-2 sm:flex flex-row sm:justify-between gap-4 sm:gap-4 items-center text-center shadow-sm mb-6 sm:mb-8">
            <h4 className="col-span-2 w-full font-black text-brand-dark text-[10px] sm:text-[11px] tracking-widest sm:hidden border-b border-gray-100 pb-3 mb-2">SISTEMA DE SEGURIDAD F&D</h4>
            
            <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 w-full">
              <div className="bg-gray-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 text-brand-dark">
                <ShieldCheck size={20} className="sm:hidden" />
                <ShieldCheck size={28} className="hidden sm:block" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-brand-dark leading-tight">Emitido<br className="hidden sm:block"/> digitalmente</span>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gray-100"></div>
            
            <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 w-full">
              <div className="bg-gray-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 text-brand-dark">
                <Database size={20} className="sm:hidden" />
                <Database size={28} className="hidden sm:block" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-brand-dark leading-tight">Registro exacto en<br className="hidden sm:block"/> base de datos</span>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gray-100"></div>
            
            <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 w-full">
              <div className="bg-gray-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 text-brand-dark">
                <Lock size={20} className="sm:hidden" />
                <Lock size={28} className="hidden sm:block" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-brand-dark leading-tight">Código criptográfico<br className="hidden sm:block"/> verificado</span>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gray-100"></div>
            
            <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 w-full">
              <div className="bg-green-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm border border-green-200 text-green-600">
                <CheckCircle2 size={20} className="sm:hidden" />
                <CheckCircle2 size={28} className="hidden sm:block" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-green-700 leading-tight">Documento oficial<br className="hidden sm:block"/> {displayStatus === 'VIGENTE' ? 'y vigente' : 'registrado'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 bg-brand-dark text-white p-4 sm:p-5 rounded-2xl shadow-inner text-center sm:text-left">
            <div className="bg-brand-teal/20 p-2 rounded-xl shrink-0 text-brand-lime">
              <Info size={20} className="sm:hidden" />
              <Info size={24} className="hidden sm:block" />
            </div>
            <p className="text-[11px] sm:text-xs leading-relaxed text-brand-light font-medium pt-0.5 sm:pt-1">
              Si tiene dudas sobre la procedencia de este certificado o detecta alguna anomalía, puede contactarse de inmediato con F&D Ingeniería en Mantenimiento a través de los canales oficiales publicados en nuestro sitio web.
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-brand-dark text-white px-5 sm:px-10 py-6 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6 border-t-[6px] border-brand-teal">
          <div className="flex flex-row items-center gap-3 sm:gap-4 text-left w-full md:w-auto">
            <div className="bg-white p-1.5 sm:p-2 rounded-xl shrink-0 shadow-md">
              <Image src="/logo.jpeg" alt="F&D Ingeniería" width={45} height={45} className="object-contain sm:w-[55px] sm:h-[55px]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black leading-tight tracking-wide">INGENIERÍA EN MANTENIMIENTO</h2>
              <p className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.25em] text-brand-teal font-bold mt-1 sm:mt-1.5">CONFIABILIDAD • PRECISIÓN</p>
            </div>
          </div>
          
          <div className="flex flex-col items-start gap-1.5 sm:gap-2 border-t border-white/10 md:border-t-0 md:border-l pt-5 sm:pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
            <p className="text-brand-lime font-black text-[9px] sm:text-[10px] uppercase tracking-widest mb-0.5 sm:mb-1.5">Contacto Oficial</p>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs hover:text-brand-teal transition font-medium text-brand-light">
              <Mail size={14} className="text-brand-teal sm:hidden" />
              <Mail size={16} className="text-brand-teal hidden sm:block" /> {contactEmail}
            </a>
            <a href="https://www.fydingenieria.cl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs hover:text-brand-teal transition font-medium text-brand-light mt-0.5 sm:mt-1">
              <Globe size={14} className="text-brand-teal sm:hidden" />
              <Globe size={16} className="text-brand-teal hidden sm:block" /> www.fydingenieria.cl
            </a>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-start gap-3 border-t border-white/10 md:border-t-0 md:border-l pt-5 sm:pt-6 md:pt-0 md:pl-8 w-full md:w-auto text-left">
            <div className="flex items-center justify-center bg-brand-teal/20 p-2 sm:p-2.5 rounded-xl shrink-0">
              <ShieldCheck size={24} className="text-brand-teal sm:hidden" />
              <ShieldCheck size={28} className="text-brand-teal hidden sm:block" />
            </div>
            <p className="text-[9px] sm:text-[10px] text-brand-light/80 max-w-[200px] leading-relaxed font-medium mt-0 sm:mt-1">
              Comprometidos con la calidad corporativa, la confiabilidad operacional y el desarrollo técnico continuo.
            </p>
          </div>
        </div>

      </div>
      
      {/* Print Button (Floating) */}
      <PrintButton />
    </main>
  );
}
