import { prisma } from '@/lib/db';
import { CredentialStatus, CredentialType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { initWebpayRecovery } from '@/actions/webpay';

type PageProps = {
  searchParams: Promise<{ code?: string; rut?: string }>;
};

function StatusBadge({ status }: { status: CredentialStatus }) {
  if (status === 'VIGENTE') {
    return <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lime/20 text-brand-dark rounded-full font-bold text-sm border border-brand-lime"><span className="text-brand-lime">✓</span> VIGENTE</span>;
  }
  if (status === 'EXPIRADO') {
    return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-sm border border-amber-300">⚠ EXPIRADO</span>;
  }
  return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-sm border border-red-300">✕ REVOCADO</span>;
}

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
  const { code, rut } = await searchParams;

  // 1. Vista de Validación de Código
  if (code) {
    const cred = await prisma.credential.findUnique({
      where: { validationCode: code },
      include: { holder: true, courseSession: true }
    });

    if (!cred) {
      return (
        <main className="container mx-auto py-10 px-4 max-w-2xl text-center">
          <h1 className="font-heading text-3xl font-bold mb-6 text-brand-teal">Validación de Credenciales</h1>
          <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold mb-2">Credencial No Encontrada</h2>
            <p>El código ingresado ({code}) no corresponde a una credencial válida en nuestros registros.</p>
          </div>
          <a href="/certificados" className="mt-8 inline-block text-brand-teal underline">Volver a buscar</a>
        </main>
      );
    }

    // Dynamic Recalculation of Expiry Status
    let displayStatus = cred.status;
    if (displayStatus === 'VIGENTE' && cred.expiryDate && cred.expiryDate < new Date()) {
      displayStatus = 'EXPIRADO';
    }

    const isDiploma = cred.type === CredentialType.DIPLOMA_CAPACITACION;

    return (
      <main className="container mx-auto py-10 px-4 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold mb-6 text-brand-teal text-center">Resultado de Validación</h1>
        
        <div className="bg-brand-white shadow-lg rounded-xl overflow-hidden border border-brand-light relative">
          <div className="bg-brand-dark p-6 flex justify-between items-center text-brand-white border-b-4 border-brand-teal">
            <div>
              <p className="text-sm uppercase tracking-widest text-brand-lime font-bold mb-1">
                {isDiploma ? 'Diploma Oficial' : 'Validación de Informe'}
              </p>
              <h2 className="text-2xl font-bold">{cred.holder.fullName}</h2>
              <p className="text-brand-light/80">{isDiploma ? cred.holder.company : cred.clientCompany}</p>
            </div>
            <div className="text-right">
              <StatusBadge status={displayStatus} />
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-brand-grey font-bold">Tipo de Credencial</p>
                <p>{isDiploma ? 'Diploma de Capacitación' : 'Certificado de Informe Técnico'}</p>
              </div>
              <div>
                <p className="text-brand-grey font-bold">Código de Validación</p>
                <p className="font-mono">{cred.validationCode}</p>
              </div>

              {isDiploma ? (
                <>
                  <div className="col-span-2">
                    <p className="text-brand-grey font-bold">Programa</p>
                    <p className="text-lg font-medium">{cred.courseSlug?.replace(/-/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-brand-grey font-bold">Tipo de Aprobación</p>
                    <p>{cred.approvalType}</p>
                  </div>
                  <div>
                    <p className="text-brand-grey font-bold">Fecha</p>
                    <p>{cred.issueDate.toLocaleDateString('es-CL')}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <p className="text-brand-grey font-bold">Servicio Prestado</p>
                    <p className="text-lg font-medium">{serviceNameMap[cred.serviceSlug as string] || cred.serviceSlug}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-brand-grey font-bold">Título del Informe</p>
                    <p>{cred.reportTitle}</p>
                  </div>
                  <div>
                    <p className="text-brand-grey font-bold">Equipo / Activo</p>
                    <p>{cred.equipmentTag || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-brand-grey font-bold">Emisión</p>
                    <p>{cred.issueDate.toLocaleDateString('es-CL')}</p>
                  </div>
                  {cred.findingsSummary && (
                    <div className="col-span-2">
                      <p className="text-brand-grey font-bold">Resumen de Hallazgos</p>
                      <p className="italic">{cred.findingsSummary}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/certificados" className="text-brand-teal underline font-medium">Validar otra credencial</a>
        </div>
      </main>
    );
  }

  // 2. Vista de Búsqueda por RUT (Recuperación)
  if (rut) {
    const creds = await prisma.credential.findMany({
      where: { holder: { rut }, status: 'VIGENTE' },
      orderBy: { issueDate: 'desc' }
    });

    return (
      <main className="container mx-auto py-10 px-4 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold mb-6 text-brand-teal text-center">Recuperar Credencial</h1>
        {creds.length === 0 ? (
          <div className="text-center bg-brand-light p-6 rounded">
            <p>No se encontraron credenciales vigentes para el RUT ingresado.</p>
            <a href="/certificados" className="text-brand-teal underline mt-4 inline-block">Volver</a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-brand-dark mb-4">Seleccione la credencial que desea recuperar. Se cobrará una tarifa de recuperación.</p>
            {creds.map(c => (
              <div key={c.id} className="border border-brand-light bg-brand-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-brand-dark">
                    {c.type === 'INFORME_SERVICIO' ? `Informe: ${serviceNameMap[c.serviceSlug as string] || c.serviceSlug}` : `Diploma: ${c.courseSlug?.replace(/-/g, ' ')}`}
                  </p>
                  <p className="text-sm text-brand-grey">Emitido: {c.issueDate.toLocaleDateString('es-CL')} | Código: <span className="font-mono">{c.validationCode}</span></p>
                </div>
                <form action={async () => {
                  'use server';
                  const res = await initWebpayRecovery(c.validationCode);
                  if (res.url && res.token) {
                    redirect(`${res.url}?token_ws=${res.token}`);
                  }
                }}>
                  <button type="submit" className="bg-brand-teal text-white px-4 py-2 rounded font-bold hover:bg-brand-dark transition">
                    Recuperar ($12.000)
                  </button>
                </form>
              </div>
            ))}
            <div className="text-center mt-8">
              <a href="/certificados" className="text-brand-grey underline">Volver</a>
            </div>
          </div>
        )}
      </main>
    );
  }

  // 3. Vista Principal (Formularios de ingreso)
  return (
    <main className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl font-bold mb-4 text-brand-teal">Portal de Credenciales</h1>
        <p className="text-brand-grey">Valide la autenticidad de informes técnicos de servicio o diplomas de capacitación, o recupere una credencial perdida.</p>
      </div>

      <div className="bg-brand-white p-8 rounded-xl shadow-lg border border-brand-light mb-8">
        <h2 className="text-xl font-bold mb-4 text-brand-dark border-b border-brand-light pb-2">Validar Credencial</h2>
        <form action={async (formData) => {
          'use server';
          const code = formData.get('code') as string;
          if (code) redirect(`/certificados?code=${code.trim().toUpperCase()}`);
        }} className="flex gap-4">
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

      <div className="bg-brand-light/50 p-8 rounded-xl border border-brand-light">
        <h2 className="text-xl font-bold mb-4 text-brand-dark border-b border-brand-grey/20 pb-2">Recuperar Credencial Perdida</h2>
        <p className="text-sm text-brand-grey mb-4">Si perdió su PDF, ingrese su RUT para iniciar el proceso de recuperación (Tarifa: $12.000 CLP).</p>
        <form action={async (formData) => {
          'use server';
          const rut = formData.get('rut') as string;
          if (rut) redirect(`/certificados?rut=${encodeURIComponent(rut.trim())}`);
        }} className="flex gap-4">
          <input 
            type="text" 
            name="rut" 
            placeholder="Ej. 12.345.678-9" 
            className="flex-1 border border-brand-grey/30 rounded p-3"
            required
          />
          <button type="submit" className="bg-brand-dark text-white px-6 py-3 rounded font-bold hover:bg-brand-teal transition-colors">
            Buscar RUT
          </button>
        </form>
      </div>
    </main>
  );
}
