'use client';

import React, { useState } from 'react';
import { Enrollment, EnrollmentStatus } from '@prisma/client';
import { updateEnrollmentStatus, updateEnrollmentNotes, deleteEnrollment } from '@/actions/enrollments';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface Props {
  initialEnrollments: Enrollment[];
}

const STATUS_LABELS: Record<EnrollmentStatus, string> = {
  INSCRITO: 'Inscrito',
  CONFIRMADO: 'Confirmado',
  RECHAZADO: 'Rechazado',
  LISTA_ESPERA: 'Lista de espera',
};

const STATUS_STYLES: Record<EnrollmentStatus, string> = {
  INSCRITO: 'bg-brand-teal/10 text-brand-teal',
  CONFIRMADO: 'bg-brand-lime/20 text-brand-dark',
  RECHAZADO: 'bg-red-100 text-red-600',
  LISTA_ESPERA: 'bg-yellow-100 text-yellow-800',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  SIN_EXPERIENCIA: 'Sin experiencia',
  ANIOS_1_3: '1–3 años',
  ANIOS_3_5: '3–5 años',
  MAS_5: '+5 años',
  BASICA: 'Básica',
  INTERMEDIA: 'Intermedia',
  AVANZADA: 'Avanzada',
};

export default function EnrollmentsManager({ initialEnrollments }: Props) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const handleStatusChange = async (id: string, status: EnrollmentStatus) => {
    setEnrollments(enrollments.map(e => (e.id === id ? { ...e, status } : e)));
    const res = await updateEnrollmentStatus(id, status);
    if (!res.success) {
      alert(res.error);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const notes = notesDraft[id] ?? '';
    const res = await updateEnrollmentNotes(id, notes);
    if (res.success) {
      setEnrollments(enrollments.map(e => (e.id === id ? { ...e, notes } : e)));
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta inscripción? Esta acción no se puede deshacer.')) return;
    const res = await deleteEnrollment(id);
    if (res.success) {
      setEnrollments(enrollments.filter(e => e.id !== id));
    } else {
      alert(res.error);
    }
  };

  if (enrollments.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center text-brand-grey">
        Aún no hay inscritos en esta sesión.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
          <tr>
            <th className="px-4 py-3"></th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">RUT</th>
            <th className="px-4 py-3">Empresa</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {enrollments.map(en => {
            const isExpanded = expandedId === en.id;
            return (
              <React.Fragment key={en.id}>
                <tr className="hover:bg-brand-light/10 transition">
                  <td className="px-4 py-3">
                    <button onClick={() => setExpandedId(isExpanded ? null : en.id)} className="text-brand-grey hover:text-brand-dark">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-dark">{en.fullName}</td>
                  <td className="px-4 py-3">{en.rut}</td>
                  <td className="px-4 py-3">{en.company || '—'}</td>
                  <td className="px-4 py-3">
                    <div>{en.email}</div>
                    <div className="text-xs text-brand-grey">{en.phone}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{format(new Date(en.createdAt), 'dd MMM yyyy', { locale: es })}</td>
                  <td className="px-4 py-3">
                    <select
                      value={en.status}
                      onChange={(e) => handleStatusChange(en.id, e.target.value as EnrollmentStatus)}
                      className={`text-xs font-bold rounded px-2 py-1 border-0 ${STATUS_STYLES[en.status]}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(en.id)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 bg-brand-light/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-bold text-brand-dark mb-1">Antecedentes</h4>
                          <p className="text-brand-grey">Cargo: {en.position || '—'}</p>
                          <p className="text-brand-grey">Área: {en.department || '—'}</p>
                          <p className="text-brand-grey">Formación: {en.education || '—'}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-dark mb-1">Experiencia</h4>
                          <p className="text-brand-grey">Mantenimiento: {en.maintenanceExperience ? EXPERIENCE_LABELS[en.maintenanceExperience] : '—'}</p>
                          <p className="text-brand-grey">Técnica del curso: {en.techExperience ? EXPERIENCE_LABELS[en.techExperience] : '—'}</p>
                          <p className="text-brand-grey">Certificaciones: {en.relatedCertifications || '—'}</p>
                          <p className="text-brand-grey">Cursos previos: {en.previousCourses || '—'}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-dark mb-1">Facturación</h4>
                          <p className="text-brand-grey">Razón social: {en.businessName || '—'}</p>
                          <p className="text-brand-grey">RUT empresa: {en.businessRut || '—'}</p>
                          <p className="text-brand-grey">Contacto: {en.coordinationContact || '—'}</p>
                          <p className="text-brand-grey">Correo facturación: {en.billingEmail || '—'}</p>
                          <p className="text-brand-grey">OC / referencia: {en.purchaseOrder || '—'}</p>
                        </div>
                        {en.specialRequirements && (
                          <div className="md:col-span-3">
                            <h4 className="font-bold text-brand-dark mb-1">Requerimientos especiales</h4>
                            <p className="text-brand-grey">{en.specialRequirements}</p>
                          </div>
                        )}
                        <div className="md:col-span-3">
                          <h4 className="font-bold text-brand-dark mb-1">Observaciones (uso interno)</h4>
                          <div className="flex gap-2">
                            <textarea
                              defaultValue={en.notes || ''}
                              onChange={(e) => setNotesDraft(prev => ({ ...prev, [en.id]: e.target.value }))}
                              rows={2}
                              className="flex-1 border border-brand-grey/30 rounded px-3 py-2 text-sm"
                              placeholder="Notas internas sobre este participante..."
                            />
                            <button onClick={() => handleSaveNotes(en.id)} className="self-start bg-brand-teal text-white text-xs font-bold px-3 py-2 rounded hover:bg-brand-dark transition">
                              Guardar
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
