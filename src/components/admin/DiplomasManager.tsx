'use client';

import React, { useState, useEffect } from 'react';
import { Credential } from '@prisma/client';
import { issueCourseDiploma, CourseDiplomaBulkData, updateCourseDiploma, generateDiplomaPdfBase64, resendCourseDiploma } from '@/actions/credentials';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

interface Props {
  initialCredentials: any[];
  courses: { slug: string, title: string, category: string }[];
}

export default function DiplomasManager({ initialCredentials, courses }: Props) {
  const router = useRouter();
  const [credentials, setCredentials] = useState(initialCredentials);

  useEffect(() => {
    setCredentials(initialCredentials);
  }, [initialCredentials]);
  const [isDiplomaModalOpen, setIsDiplomaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDiploma, setEditingDiploma] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleIssueDiploma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const courseSlug = formData.get('courseSlug') as string;
    
    const slugLower = courseSlug.toLowerCase();
    let abbreviation = 'GEN';
    if (slugLower.includes('vibraciones')) abbreviation = 'VA';
    else if (slugLower.includes('alineamiento')) abbreviation = 'LA';
    else if (slugLower.includes('balanceo')) abbreviation = 'DB';
    else if (slugLower.includes('termografia')) abbreviation = 'IRT';

    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    
    let courseDates = '';
    if (startDate && endDate) {
      const [y1, m1, d1] = startDate.split('-');
      const [y2, m2, d2] = endDate.split('-');
      const mName1 = monthNames[parseInt(m1, 10) - 1];
      const mName2 = monthNames[parseInt(m2, 10) - 1];
      
      if (startDate === endDate) {
        courseDates = `${parseInt(d1, 10)} de ${mName1} del ${y1}`;
      } else if (y1 === y2 && m1 === m2) {
        courseDates = `${parseInt(d1, 10)} al ${parseInt(d2, 10)} de ${mName1} del ${y1}`;
      } else if (y1 === y2) {
        courseDates = `${parseInt(d1, 10)} de ${mName1} al ${parseInt(d2, 10)} de ${mName2} del ${y1}`;
      } else {
        courseDates = `${parseInt(d1, 10)} de ${mName1} del ${y1} al ${parseInt(d2, 10)} de ${mName2} del ${y2}`;
      }
    }

    const data: CourseDiplomaBulkData = {
      courseSessionId: undefined,
      courseSlug,
      abbreviation,
      courseDates,
      courseHours: parseInt(formData.get('courseHours') as string, 10),
      issueDate: formData.get('issueDate') as string,
      participants: [{
        rut: formData.get('rut') as string,
        fullName: formData.get('fullName') as string,
        company: 'Independiente',
        email: formData.get('email') as string,
        approvalType: 'PARTICIPACION' as any,
        scorePercent: undefined,
        correlative: formData.get('correlative') as string || undefined,
      }]
    };

    const res = await issueCourseDiploma(data);
    if (res.success) {
      const hasErrors = res.results?.some(r => !r.success);
      if (hasErrors) {
        const errorMsgs = res.results?.filter(r => !r.success).map(r => r.error).join(', ');
        setError(`Error en algunos diplomas: ${errorMsgs}`);
      } else {
        alert('Diploma emitido exitosamente.');
        setIsDiplomaModalOpen(false);
        router.refresh();
      }
    } else {
      setError(res.error || 'Error al emitir diploma');
    }
    setLoading(false);
  };

  const handleEditDiploma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName') as string,
      rut: formData.get('rut') as string,
      email: formData.get('email') as string,
      courseDates: formData.get('courseDates') as string,
      courseHours: formData.get('courseHours') as string,
      correlative: formData.get('correlative') as string || undefined,
    };

    const res = await updateCourseDiploma(editingDiploma.id, data);
    if (res.success) {
      alert('Diploma actualizado exitosamente.');
      setIsEditModalOpen(false);
      router.refresh();
    } else {
      setError(res.error || 'Error al actualizar diploma');
    }
    setLoading(false);
  };

  const handleDownloadPdf = async (credentialId: string, certNumber: string) => {
    setLoadingPdf(credentialId);
    const res = await generateDiplomaPdfBase64(credentialId);
    if (res.success && res.base64) {
      const linkSource = `data:application/pdf;base64,${res.base64}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = `Diploma_${certNumber}.pdf`;
      downloadLink.click();
    } else {
      alert(res.error || 'Error al generar PDF');
    }
    setLoadingPdf(null);
  };

  const handleResendEmail = async (credentialId: string) => {
    if (!confirm('¿Estás seguro de reenviar este diploma por correo al participante?')) return;
    setLoadingEmail(credentialId);
    const res = await resendCourseDiploma(credentialId);
    if (res.success) {
      alert('Correo reenviado exitosamente.');
    } else {
      alert(res.error || 'Error al reenviar correo');
    }
    setLoadingEmail(null);
  };

  const openEditModal = (c: any) => {
    setEditingDiploma(c);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Gestión de Diplomas</h2>
        <button onClick={() => setIsDiplomaModalOpen(true)} className="w-full md:w-auto bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition">
          + Emitir Diploma
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Folio</th>
              <th className="px-6 py-3">Participante</th>
              <th className="px-6 py-3">Curso / Especialidad</th>
              <th className="px-6 py-3">Fecha Emisión</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light/20">
            {credentials.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-grey">No hay diplomas emitidos</td></tr>
            ) : credentials.map(c => (
              <tr key={c.id} className="hover:bg-brand-light/10 transition">
                <td className="px-6 py-4 font-mono font-bold text-brand-teal">{c.certificateNumber || c.validationCode.substring(0, 8)}</td>
                <td className="px-6 py-4">
                  <div className="font-bold">{c.holder.fullName}</div>
                  <div className="text-xs text-brand-grey">{c.holder.rut} | {c.holder.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-brand-light px-2 py-1 rounded text-xs font-bold text-brand-dark">{c.courseSlug}</span>
                  <div className="text-xs text-brand-grey mt-1">{c.courseHours} Hrs | {c.courseDates}</div>
                </td>
                <td className="px-6 py-4">{format(new Date(c.issueDate), 'dd MMM yyyy', { locale: es })}</td>
                <td className="px-6 py-4 text-right flex flex-col md:flex-row gap-2 justify-end">
                  <button onClick={() => openEditModal(c)} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition">Editar</button>
                  <button 
                    onClick={() => handleDownloadPdf(c.id, c.certificateNumber || 'PDF')} 
                    disabled={loadingPdf === c.id}
                    className="text-xs px-3 py-1 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal font-bold rounded transition disabled:opacity-50"
                  >
                    {loadingPdf === c.id ? 'Generando...' : 'Ver PDF'}
                  </button>
                  <button 
                    onClick={() => handleResendEmail(c.id)} 
                    disabled={loadingEmail === c.id}
                    className="text-xs px-3 py-1 bg-brand-dark text-white rounded hover:bg-brand-dark/80 transition disabled:opacity-50"
                  >
                    {loadingEmail === c.id ? 'Enviando...' : 'Reenviar Email'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDiplomaModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">Emitir Nuevo Diploma</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleIssueDiploma} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Especialidad / Curso</label>
                <select name="courseSlug" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                  <option value="">Selecciona especialidad...</option>
                  {courses.map(c => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Fecha de inicio</label>
                  <input type="date" name="startDate" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Fecha de término</label>
                  <input type="date" name="endDate" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Cantidad de Horas</label>
                <input type="number" name="courseHours" required min="1" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: 24" />
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

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Email (Envío PDF)</label>
                <input type="email" name="email" required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Fecha Emisión del Diploma</label>
                  <input type="date" name="issueDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">N° Certificado (Solo Correlativo)</label>
                  <input type="text" name="correlative" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Opcional. Ej: 001" />
                  <p className="text-[10px] text-gray-500 mt-1">El prefijo F&D-CURSO-AÑO- se añade automático.</p>
                </div>
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

      {isEditModalOpen && editingDiploma && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">Editar Diploma: {editingDiploma.certificateNumber}</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleEditDiploma} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Nombre Completo</label>
                <input type="text" name="fullName" defaultValue={editingDiploma.holder.fullName} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">RUT</label>
                  <input type="text" name="rut" defaultValue={editingDiploma.holder.rut} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Horas</label>
                  <input type="number" name="courseHours" defaultValue={editingDiploma.courseHours} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Email</label>
                <input type="email" name="email" defaultValue={editingDiploma.holder.email} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">N° Certificado (Solo Correlativo)</label>
                <input type="text" name="correlative" defaultValue={editingDiploma.certificateNumber ? editingDiploma.certificateNumber.split('-').pop() : ''} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Opcional. Ej: 001" />
                <p className="text-[10px] text-gray-500 mt-1">El prefijo se mantiene, solo cambias el número final.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Texto de Fechas (Aparece en PDF)</label>
                <input type="text" name="courseDates" defaultValue={editingDiploma.courseDates} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-light">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-brand-grey hover:bg-brand-light rounded transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-brand-teal text-white rounded hover:bg-brand-dark transition disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
