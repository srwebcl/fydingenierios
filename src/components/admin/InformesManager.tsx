'use client';

import React, { useState } from 'react';
import { CredentialRecoveryPayment } from '@prisma/client';
import { issueServiceReportCredential, ServiceReportCredentialData } from '@/actions/credentials';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  initialCredentials: any[];
  initialPayments: CredentialRecoveryPayment[];
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

export default function InformesManager({ initialCredentials, initialPayments }: Props) {
  const [tab, setTab] = useState<'INFORMES' | 'PAGOS'>('INFORMES');
  const [credentials] = useState(initialCredentials);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const informes = credentials.filter(c => c.type === 'INFORME_SERVICIO');

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

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Informes Técnicos</h2>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setTab('INFORMES')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition ${tab === 'INFORMES' ? 'bg-brand-teal text-white shadow' : 'bg-brand-light text-brand-grey hover:bg-brand-teal/10'}`}
          >
            Informes Emitidos
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
                  <th className="px-6 py-3">Servicio</th>
                  <th className="px-6 py-3">Profesional (F&D)</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light/20">
                {informes.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-brand-grey">No hay informes emitidos</td></tr>
                ) : informes.map(c => (
                  <tr key={c.id} className="hover:bg-brand-light/10 transition">
                    <td className="px-6 py-4 font-mono font-bold text-brand-teal">{c.validationCode}</td>
                    <td className="px-6 py-4">{c.clientCompany || 'N/A'}</td>
                    <td className="px-6 py-4 text-xs">
                      {serviceNameMap[c.serviceSlug || ''] || c.serviceSlug}
                      <div className="text-brand-grey">{c.equipmentTag}</div>
                    </td>
                    <td className="px-6 py-4">
                      {c.holder.fullName}
                      <div className="text-xs text-brand-grey">{c.holder.rut}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        c.status === 'VIGENTE' ? 'bg-green-100 text-green-700' :
                        c.status === 'REVOCADO' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    </td>
                  </tr>
                ))}
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
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Email Pago</th>
                <th className="px-6 py-3">N° Credencial</th>
                <th className="px-6 py-3">Monto</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light/20">
              {initialPayments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-grey">No hay pagos registrados</td></tr>
              ) : initialPayments.map(p => (
                <tr key={p.id} className="hover:bg-brand-light/10 transition">
                  <td className="px-6 py-4">{format(new Date(p.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4 font-mono">{p.credentialId}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">${p.amount.toLocaleString('es-CL')}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">Completado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">Emitir Certificado de Informe</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleIssueReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">RUT Profesional F&D</label>
                  <input type="text" name="rut" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="12.345.678-9" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Nombre Completo F&D</label>
                  <input type="text" name="fullName" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="hidden" name="company" value="F&D Ingenieros" />
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Email Profesional (Opcional)</label>
                  <input type="email" name="email" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" defaultValue="contacto@fydingenieria.cl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Teléfono (Opcional)</label>
                  <input type="tel" name="phone" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <hr className="my-4 border-brand-light" />
              <h4 className="font-bold text-sm text-brand-dark mb-2">Datos del Servicio (Opcional)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Empresa Mandante</label>
                  <input type="text" name="clientCompany" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Minera Escondida" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Tipo de Servicio</label>
                  <select name="serviceSlug" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                    <option value="">Selecciona servicio...</option>
                    {Object.entries(serviceNameMap).map(([slug, name]) => (
                      <option key={slug} value={slug}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Equipo / TAG</label>
                  <input type="text" name="equipmentTag" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Bomba Centrífuga P-101" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Título del Informe</label>
                  <input type="text" name="reportTitle" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Análisis Vibracional P-101" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Conclusión Corta (Max 250 carac.)</label>
                <textarea name="findingsSummary" rows={2} maxLength={250} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Alarma nivel crítico por desbalanceo en rodamiento lado acople."></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Fecha Emisión</label>
                <input type="date" name="issueDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-light">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm text-brand-grey hover:bg-brand-light rounded transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-brand-teal text-white rounded hover:bg-brand-dark transition disabled:opacity-50">
                  {loading ? 'Generando...' : 'Emitir Certificado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
