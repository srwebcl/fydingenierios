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
  
  // Extraer configuración
  const settings = await prisma.settings.findFirst();
  const contactEmail = settings?.contactEmail || 'contacto@fydingenieria.cl';

  // Configuración de visualización basada en el estado
  const statusConfig = {
    VIGENTE: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CheckCircle2 size={48} className="text-green-600" />,
      title: 'DOCUMENTO AUTÉNTICO',
      subtitle: 'La autenticidad de este certificado ha sido verificada exitosamente en la base de datos de F&D Ingeniería en Mantenimiento.',
      badgeIcon: <ShieldCheck size={32} className="text-green-600" />
    },
    EXPIRADO: {
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: <AlertCircle size={48} className="text-amber-600" />,
      title: 'DOCUMENTO EXPIRADO',
      subtitle: 'Este documento es auténtico pero su fecha de vigencia ha expirado según nuestros registros.',
      badgeIcon: <AlertCircle size={32} className="text-amber-600" />
    },
    REVOCADO: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <XCircle size={48} className="text-red-600" />,
      title: 'DOCUMENTO REVOCADO',
      subtitle: 'Este documento ha sido revocado y ya no es válido para propósitos oficiales.',
      badgeIcon: <XCircle size={32} className="text-red-600" />
    }
  };

  const config = statusConfig[displayStatus];

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center print:bg-white print:py-0 font-sans text-brand-dark">
      
      {/* A4 Container */}
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden print:shadow-none">
        
        {/* HEADER */}
        <div className="bg-brand-dark text-white px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <Image src="/logo.jpeg" alt="F&D Ingeniería" width={60} height={60} className="object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">INGENIERÍA EN</h1>
              <h1 className="text-lg font-bold leading-tight">MANTENIMIENTO</h1>
              <p className="text-[10px] tracking-widest text-brand-light mt-1">CONFIABILIDAD • PRECISIÓN • RESULTADOS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-brand-lime" />
            <div className="text-right sm:text-left">
              <h2 className="text-xl font-bold leading-tight uppercase">Validación de Certificados</h2>
              <p className="text-xs text-brand-light/90">Verifica la autenticidad de tu certificado</p>
              <p className="text-xs text-brand-light/90">o informe técnico oficial F&D.</p>
            </div>
          </div>
        </div>

        {/* MAIN AUTHENTICITY BLOCK */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            
            {/* Left Result */}
            <div className="flex-1">
              <div className="flex gap-4 items-start mb-4">
                <div className={`p-2 rounded-full border-4 ${config.borderColor}`}>
                  {config.icon}
                </div>
                <div>
                  <h2 className={`text-3xl font-bold uppercase mb-2 ${config.color}`}>{config.title}</h2>
                  <p className="text-brand-grey font-medium leading-relaxed max-w-lg">
                    {config.subtitle}
                  </p>
                </div>
              </div>
              {isDiploma && displayStatus === 'VIGENTE' && (
                <div className="flex items-center gap-2 mt-4 text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                  <Check size={18} />
                  <span className="text-sm font-medium">El participante completó el programa y aprobó satisfactoriamente.</span>
                </div>
              )}
            </div>

            {/* Right Status Badge */}
            <div className="w-full md:w-72 shrink-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="p-4 flex gap-4 items-center bg-gray-50 flex-1 border-b border-gray-200">
                  {config.badgeIcon}
                  <div>
                    <p className="text-xs font-bold text-brand-grey uppercase">ESTADO DEL DOCUMENTO</p>
                    <p className={`text-2xl font-black uppercase tracking-wide ${config.color}`}>{displayStatus}</p>
                  </div>
                </div>
                <div className="p-4 flex gap-3 items-center bg-white">
                  <Calendar size={24} className="text-brand-grey" />
                  <div>
                    <p className="text-xs text-brand-grey">Última verificación</p>
                    <p className="text-sm font-bold">{new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-xs text-brand-grey">{new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} hrs.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* INFORMATION CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Card 1: Participante / Cliente */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-dark p-2 rounded-full text-white">
                  <User size={20} />
                </div>
                <h3 className="font-bold text-brand-dark uppercase text-sm tracking-wide">
                  {isDiploma ? 'Información del Participante' : 'Información del Cliente'}
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-brand-grey font-medium uppercase mb-1">{isDiploma ? 'Nombre' : 'Empresa Cliente'}</p>
                  <p className="font-bold text-lg leading-tight">{isDiploma ? cred.holder.fullName : cred.clientCompany}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-grey font-medium uppercase mb-1">RUT / Identificación</p>
                  <p className="font-bold">{isDiploma ? cred.holder.rut : 'Registrado en Sistema'}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Documento */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-dark p-2 rounded-full text-white">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-brand-dark uppercase text-sm tracking-wide">Información del Documento</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-brand-grey font-medium uppercase mb-1">Tipo de documento</p>
                  <p className="font-medium text-sm">{isDiploma ? 'Certificado de Entrenamiento' : 'Informe Técnico de Servicio'}</p>
                </div>
                {isDiploma && cred.certificateNumber && (
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-brand-grey font-medium uppercase mb-1">N° de Certificado</p>
                    <p className="font-bold text-sm">{cred.certificateNumber}</p>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-brand-grey font-medium uppercase mb-1">Código de Validación</p>
                  <p className="font-bold text-brand-teal font-mono">{cred.validationCode}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-brand-grey font-medium uppercase mb-1">Fecha de emisión</p>
                  <p className="font-medium text-sm">{cred.issueDate.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {!isDiploma && cred.expiryDate && (
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-brand-grey font-medium uppercase mb-1">Válido hasta</p>
                    <p className="font-medium text-sm text-amber-600">{cred.expiryDate.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Programa / Servicio */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-teal p-2 rounded-full text-white">
                  <GraduationCap size={20} />
                </div>
                <h3 className="font-bold text-brand-teal uppercase text-sm tracking-wide">
                  {isDiploma ? 'Programa de Capacitación' : 'Detalle del Servicio'}
                </h3>
              </div>
              
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-brand-grey w-1/3 flex items-center gap-2"><BookOpen size={14}/> Programa</td>
                    <td className="py-2 font-bold">{isDiploma ? cred.courseSlug?.replace(/-/g, ' ').toUpperCase() : (serviceNameMap[cred.serviceSlug as string] || cred.serviceSlug)?.toUpperCase()}</td>
                  </tr>
                  
                  {isDiploma ? (
                    <>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-brand-grey flex items-center gap-2"><CheckCircle2 size={14}/> Resultado</td>
                        <td className="py-2">
                          <span className="text-green-600 font-bold">{cred.approvalType?.toUpperCase() || 'APROBADO'}</span>
                          <p className="text-xs text-brand-grey mt-1">El participante realizó la evaluación final y aprobó satisfactoriamente el curso.</p>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-brand-grey flex items-center gap-2"><FileText size={14}/> Título</td>
                        <td className="py-2 font-medium">{cred.reportTitle}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-brand-grey flex items-center gap-2"><Info size={14}/> Equipo</td>
                        <td className="py-2 font-medium">{cred.equipmentTag || 'N/A'}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Card 4: Organismo y Emisor combinados */}
            <div className="space-y-6">
              
              {/* Emisor */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-teal p-2 rounded-full text-white">
                    <User size={20} />
                  </div>
                  <h3 className="font-bold text-brand-teal uppercase text-sm tracking-wide">
                    {isDiploma ? 'Instructor Responsable' : 'Ingeniero Responsable'}
                  </h3>
                </div>
                <p className="font-bold text-lg mb-1">{isDiploma ? (cred as any).courseInstructor || 'Alamiro Andrés Fernández Huenuqueo' : 'Ingeniería F&D'}</p>
                <p className="text-sm text-brand-grey">
                  Elaborado y validado por equipo técnico especializado.
                </p>
              </div>

              {/* Organismo */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-teal p-2 rounded-full text-white">
                    <Building size={20} />
                  </div>
                  <h3 className="font-bold text-brand-teal uppercase text-sm tracking-wide">Organismo Emisor</h3>
                </div>
                <p className="font-bold text-lg">F&D Ingeniería en Mantenimiento</p>
                <p className="text-sm text-brand-grey mb-2">{isDiploma ? 'Academia F&D' : 'División de Servicios y Confiabilidad'}</p>
                <a href="https://www.fydingenieria.cl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-teal font-medium">
                  <Globe size={14} /> www.fydingenieria.cl
                </a>
              </div>

            </div>

          </div>

          {/* ALCANCE BOX */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-600 p-2 rounded-full text-white">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-green-800 uppercase text-sm tracking-wide">Alcance del Documento</h3>
            </div>
            
            {isDiploma ? (
              <div className="text-sm text-green-900 space-y-3 pl-12">
                <p>Este certificado acredita que el participante completó satisfactoriamente el programa de entrenamiento impartido por <strong>F&D Ingeniería en Mantenimiento</strong>.</p>
                <p>El contenido del programa fue desarrollado considerando los lineamientos técnicos aplicables y las mejores prácticas de la industria.</p>
                <div className="flex gap-3 items-start bg-green-100 p-3 rounded border border-green-300 mt-2">
                  <Info size={16} className="shrink-0 mt-0.5 text-green-700" />
                  <p className="text-xs text-green-800">
                    Este documento acredita la realización del entrenamiento impartido por F&D Ingeniería en Mantenimiento y <strong>no constituye una certificación internacional de competencia emitida por un organismo certificador acreditado</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-green-900 space-y-3 pl-12">
                <p>Este documento certifica la autenticidad del informe técnico emitido por <strong>F&D Ingeniería en Mantenimiento</strong>.</p>
                <p>Los resultados y hallazgos detallados en el informe físico o digital original son respaldados por nuestros ingenieros especialistas.</p>
                {cred.findingsSummary && (
                  <div className="bg-green-100 p-4 rounded border border-green-300 mt-2">
                    <p className="text-xs uppercase font-bold text-green-800 mb-1">Resumen Oficial:</p>
                    <p className="italic font-medium">{cred.findingsSummary}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Background seal watermark effect */}
            <div className="absolute right-10 bottom-40 opacity-5 pointer-events-none hidden md:block">
              <ShieldCheck size={250} />
            </div>
          </div>

          {/* SECURITY & AUTHENTICITY BAR */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-wrap md:flex-nowrap justify-between gap-4 text-xs font-medium text-brand-grey mb-6 items-center">
            <h4 className="w-full text-center font-bold text-brand-dark mb-2 md:hidden">SEGURIDAD Y AUTENTICIDAD</h4>
            
            <div className="flex items-center gap-2">
              <ShieldCheck size={24} className="text-brand-dark" />
              <span>Documento<br/>emitido digitalmente</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>
            
            <div className="flex items-center gap-2">
              <Database size={24} className="text-brand-dark" />
              <span>Registro encontrado en<br/>la base de datos</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>
            
            <div className="flex items-center gap-2">
              <Lock size={24} className="text-brand-dark" />
              <span>Código de validación<br/>verificado correctamente</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>
            
            <div className="flex items-center gap-2">
              <CheckCircle2 size={24} className="text-green-600" />
              <span className="text-green-700">Documento<br/>auténtico {displayStatus === 'VIGENTE' && 'y vigente'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-brand-dark text-white p-4 rounded-lg">
            <Info size={20} className="shrink-0 text-brand-teal" />
            <p className="text-xs leading-relaxed">
              Si tiene dudas sobre este certificado o detecta alguna anomalía, puede contactarse con F&D Ingeniería en Mantenimiento a través de los canales oficiales publicados en nuestro sitio web.
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-brand-dark text-white px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded">
              <Image src="/logo.jpeg" alt="F&D Ingeniería" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">INGENIERÍA EN MANTENIMIENTO</h2>
              <p className="text-[8px] tracking-widest text-brand-light">CONFIABILIDAD • PRECISIÓN • RESULTADOS</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <p className="text-brand-lime font-bold text-xs uppercase tracking-wider mb-1">Contacto Oficial</p>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-xs hover:text-brand-teal transition">
              <Mail size={14} /> {contactEmail}
            </a>
            <a href="https://www.fydingenieria.cl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs hover:text-brand-teal transition">
              <Globe size={14} /> www.fydingenieria.cl
            </a>
          </div>

          <div className="flex items-center gap-3 border-l border-white/20 pl-6">
            <ShieldCheck size={32} className="text-brand-teal" />
            <p className="text-xs text-brand-light max-w-[150px]">
              Comprometidos con la calidad, la confiabilidad y el desarrollo profesional.
            </p>
          </div>
        </div>

      </div>
      
      {/* Print Button (Floating) */}
      <PrintButton />
    </main>
  );
}
