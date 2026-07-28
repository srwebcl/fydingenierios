'use client';

import React, { useState } from 'react';
import { Credential, CredentialRecoveryPayment, CourseSession, CredentialType, ApprovalType } from '@prisma/client';
import { issueServiceReportCredential, issueCourseDiploma, ServiceReportCredentialData, CourseDiplomaBulkData } from '@/actions/credentials';
import { courses } from '@/content/courses';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  initialCredentials: any[];
  initialPayments: CredentialRecoveryPayment[];
  sessions: CourseSession[];
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

export default function CertificadosManager({ initialCredentials, initialPayments, sessions }: Props) {
  const [tab, setTab] = useState<'INFORMES' | 'DIPLOMAS' | 'PAGOS'>('INFORMES');
  const [credentials, setCredentials] = useState(initialCredentials);
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const informes = credentials.filter(c => c.type === 'INFORME_SERVICIO');
  const diplomas = credentials.filter(c => c.type === 'DIPLOMA_CAPACITACION');

  const handleIssueReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data: ServiceReportCredentialData = {
      rut: formData.get('rut') as string,
      fullName: formData.get('fullName') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      serviceSlug: formData.get('serviceSlug') as string,
      clientCompany: formData.get('clientCompany') as string,
      equipmentTag: formData.get('equipmentTag') as string,
      reportTitle: formData.get('reportTitle') as string,
      findingsSummary: formData.get('findingsSummary') as string,
      issueDate: formData.get('issueDate') as string,
    };

    const res = await issueServiceReportCredential(data);
    if (res.success) {
      alert(`Informe emitido exitosamente. Código: ${res.validationCode}`);
      setIsReportModalOpen(false);
      window.location.reload(); 
    } else {
      setError(res.error || 'Error al emitir');
    }
    setLoading(false);
  };

  const handleIssueDiploma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const sessionId = formData.get('courseSessionId') as string;
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      setError('Sesión no encontrada');
      setLoading(false);
      return;
    }

    const data: CourseDiplomaBulkData = {
      courseSessionId: session.id,
      courseSlug: session.courseSlug,
      issueDate: formData.get('issueDate') as string,
      participants: [{
        rut: formData.get('rut') as string,
        fullName: formData.get('fullName') as string,
        company: formData.get('company') as string,
        email: formData.get('email') as string,
        approvalType: formData.get('approvalType') as ApprovalType,
        scorePercent: formData.get('scorePercent') ? parseInt(formData.get('scorePercent') as string) : undefined,
      }]
    };

    const res = await issueCourseDiploma(data);
    if (res.success) {
      alert('Diploma emitido exitosamente.');
      setIsDiplomaModalOpen(false);
      window.location.reload();
    } else {
      setError(res.error || 'Error al emitir diploma');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Gestor de Credenciales</h2>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setTab('INFORMES')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition ${tab === 'INFORMES' ? 'bg-brand-teal text-white shadow' : 'bg-brand-light text-brand-grey hover:bg-brand-teal/10'}`}
          >
            Informes
          </button>
          <button 
            onClick={() => setTab('DIPLOMAS')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition ${tab === 'DIPLOMAS' ? 'bg-brand-teal text-white shadow' : 'bg-brand-light text-brand-grey hover:bg-brand-teal/10'}`}
          >
            Diplomas
          </button>
          <button 
            onClick={() => setTab('PAGOS')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition ${tab === 'PAGOS' ? 'bg-brand-teal text-white shadow' : 'bg-brand-light text-brand-grey hover:bg-brand-teal/10'}`}
          >
            Recuperaciones
          </button>
        </div>
      </div>

      {tab === 'INFORMES' && (
        <>
          <div className="mb-4">
            <button onClick={() => setIsReportModalOpen(true)} className="w-full md:w-auto bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition">
              + Emitir Certificado de Informe
            </button>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Mandante</th>
                  <th className="px-6 py-3">Servicio / Título</th>
                  <th className="px-6 py-3">Emisión</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {informes.map(c => (
                  <tr key={c.id} className="border-b border-brand-light/50">
                    <td className="px-6 py-4 font-mono font-bold">{c.validationCode}</td>
                    <td className="px-6 py-4">{c.clientCompany}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold">{serviceNameMap[c.serviceSlug as string] || c.serviceSlug}</span><br/>
                      <span className="text-xs text-brand-grey">{c.reportTitle}</span>
                    </td>
                    <td className="px-6 py-4">{format(new Date(c.issueDate), 'dd MMM yyyy', {locale: es})}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'VIGENTE' ? 'bg-brand-lime text-brand-dark' : 'bg-red-100 text-red-700'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {informes.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-grey">No hay informes registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'DIPLOMAS' && (
        <>
          <div className="mb-4">
            <button onClick={() => setIsDiplomaModalOpen(true)} className="w-full md:w-auto bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition">
              + Emitir Diploma
            </button>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Titular</th>
                  <th className="px-6 py-3">Curso</th>
                  <th className="px-6 py-3">Emisión</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {diplomas.map(c => (
                  <tr key={c.id} className="border-b border-brand-light/50">
                    <td className="px-6 py-4 font-mono font-bold">{c.validationCode}</td>
                    <td className="px-6 py-4">{c.holder.fullName} <br/><span className="text-xs text-brand-grey">{c.holder.rut}</span></td>
                    <td className="px-6 py-4">{courses.find(course => course.slug === c.courseSlug)?.title || c.courseSlug}</td>
                    <td className="px-6 py-4">{format(new Date(c.issueDate), 'dd MMM yyyy', {locale: es})}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-brand-lime text-brand-dark">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {diplomas.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-grey">No hay diplomas registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'PAGOS' && (
        <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID Pago</th>
                <th className="px-6 py-3">Credencial</th>
                <th className="px-6 py-3">Monto</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {initialPayments.map(p => (
                <tr key={p.id} className="border-b border-brand-light/50">
                  <td className="px-6 py-4 font-mono font-bold">{p.id}</td>
                  <td className="px-6 py-4">{p.credentialId}</td>
                  <td className="px-6 py-4">${p.amount}</td>
                  <td className="px-6 py-4">{format(new Date(p.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'APROBADA' ? 'bg-brand-lime text-brand-dark' : p.status === 'RECHAZADA' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {initialPayments.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-grey">No hay pagos registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">Emitir Certificado de Informe Técnico</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleIssueReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">RUT Evaluador</label>
                  <input type="text" name="rut" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="12.345.678-9" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Nombre Evaluador</label>
                  <input type="text" name="fullName" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Empresa (Opcional)</label>
                  <input type="text" name="company" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" defaultValue="F&D Ingenieros" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Email (Envío PDF)</label>
                  <input type="email" name="email" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="pt-2 border-t border-brand-light">
                <h4 className="text-sm font-bold text-brand-dark mb-3">Datos del Servicio</h4>
                
                <div className="mb-3">
                  <label className="block text-xs font-bold text-brand-dark mb-1">Servicio Prestado</label>
                  <select name="serviceSlug" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                    <option value="">Selecciona servicio...</option>
                    {Object.entries(serviceNameMap).map(([slug, name]) => (
                      <option key={slug} value={slug}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Empresa Mandante</label>
                    <input type="text" name="clientCompany" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Minera XYZ" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1">Equipo / Activo (Opcional)</label>
                    <input type="text" name="equipmentTag" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Molino SAG 1" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-bold text-brand-dark mb-1">Título del Informe</label>
                  <input type="text" name="reportTitle" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Análisis Vibracional Motor Bomba 3" />
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs font-bold text-brand-dark mb-1">Resumen de Hallazgos (Opcional)</label>
                  <textarea name="findingsSummary" rows={2} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Breve resumen de los resultados..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Fecha Emisión</label>
                <input type="date" name="issueDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-light">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm text-brand-grey hover:bg-brand-light rounded transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-brand-teal text-white rounded hover:bg-brand-dark transition disabled:opacity-50">
                  {loading ? 'Generando PDF...' : 'Emitir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDiplomaModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">Emitir Diploma</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleIssueDiploma} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Sesión de Curso (Debe estar Finalizada)</label>
                <select name="courseSessionId" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                  <option value="">Selecciona sesión...</option>
                  {sessions.filter(s => s.status === 'FINALIZADA').map(s => (
                    <option key={s.id} value={s.id}>
                      {courses.find(c => c.slug === s.courseSlug)?.title} - {format(new Date(s.startDate), 'dd/MM/yy')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">RUT Participante</label>
                  <input type="text" name="rut" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="12.345.678-9" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Nombre Completo</label>
                  <input type="text" name="fullName" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Empresa</label>
                  <input type="text" name="company" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" defaultValue="Independiente" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Email (Envío PDF)</label>
                  <input type="email" name="email" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Tipo de Aprobación</label>
                  <select name="approvalType" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                    <option value="APROBACION">Aprobación</option>
                    <option value="PARTICIPACION">Participación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Nota / % (Opcional)</label>
                  <input type="number" name="scorePercent" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="100" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Fecha Emisión</label>
                <input type="date" name="issueDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-light">
                <button type="button" onClick={() => setIsDiplomaModalOpen(false)} className="px-4 py-2 text-sm text-brand-grey hover:bg-brand-light rounded transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-brand-teal text-white rounded hover:bg-brand-dark transition disabled:opacity-50">
                  {loading ? 'Generando PDF...' : 'Emitir Diploma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
