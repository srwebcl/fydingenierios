'use client';

import React, { useState } from 'react';
import { CourseSession, Course, SessionStatus } from '@prisma/client';
import { createCourseSession, updateCourseSession, closeCourseSession, finishCourseSession, deleteCourseSession, deleteCourse, getEnrollmentLinkQr } from '@/actions/capacitaciones';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toDateOnly } from '@/lib/date';
import Link from 'next/link';
import { Trash2, Copy, Users as UsersIcon, Check, Pencil, Share2, Mail, XCircle, CheckCircle2, X, Loader2 } from 'lucide-react';

interface Props {
  initialCourses: Course[];
  initialSessions: CourseSession[];
}

export default function CapacitacionesManager({ initialCourses, initialSessions }: Props) {
  const [tab, setTab] = useState<'CURSOS' | 'SESIONES'>('CURSOS');
  const [sessions, setSessions] = useState<CourseSession[]>(initialSessions);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CourseSession | null>(null);
  const [shareSession, setShareSession] = useState<CourseSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingSession(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (session: CourseSession) => {
    setEditingSession(session);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmitSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = editingSession
      ? await updateCourseSession(editingSession.id, formData)
      : await createCourseSession(formData);

    if (res.success && res.session) {
      setSessions(editingSession
        ? sessions.map(s => (s.id === res.session!.id ? res.session! : s))
        : [res.session, ...sessions]);
      setIsModalOpen(false);
      setEditingSession(null);
    } else {
      setError(res.error || 'Error desconocido');
    }
    setLoading(false);
  };

  const handleActionSession = async (id: string, action: 'close' | 'finish') => {
    if (!confirm(`¿Estás seguro de que deseas ${action === 'close' ? 'cerrar' : 'finalizar'} esta sesión?`)) return;

    const res = action === 'close' ? await closeCourseSession(id) : await finishCourseSession(id);
    if (res.success) {
      setSessions(sessions.map(s =>
        s.id === id ? { ...s, status: action === 'close' ? 'CERRADA' : 'FINALIZADA' } : s
      ));
    } else {
      alert(res.error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer.')) return;

    const res = await deleteCourseSession(id);
    if (res.success) {
      setSessions(sessions.filter(s => s.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) return;

    const res = await deleteCourse(id);
    if (res.success) {
      setCourses(courses.filter(c => c.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleCopyLink = (sessionId: string) => {
    const url = `${window.location.origin}/capacitaciones/inscripcion/${sessionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(sessionId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getStatusBadge = (status: SessionStatus) => {
    const styles = {
      ABIERTA: 'bg-brand-lime text-brand-dark',
      CUPOS_LIMITADOS: 'bg-yellow-400 text-yellow-900',
      CERRADA: 'bg-brand-grey text-white',
      FINALIZADA: 'bg-brand-dark text-brand-teal'
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${styles[status]}`}>{status}</span>;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Gestor de Cursos</h2>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setTab('CURSOS')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition ${tab === 'CURSOS' ? 'bg-brand-teal text-white shadow' : 'bg-brand-light text-brand-grey hover:bg-brand-teal/10'}`}
          >
            Plantillas de Cursos
          </button>
          <button
            onClick={() => setTab('SESIONES')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-bold transition ${tab === 'SESIONES' ? 'bg-brand-teal text-white shadow' : 'bg-brand-light text-brand-grey hover:bg-brand-teal/10'}`}
          >
            Sesiones Programadas
          </button>
        </div>
      </div>

      {tab === 'CURSOS' && (
        <>
          <div className="mb-4">
            <Link href="/admin-panel/capacitaciones/nuevo" className="inline-block bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition">
              + Crear Nuevo Curso
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Título del Curso</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3">Horas</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-brand-grey">No hay cursos registrados</td></tr>
                ) : courses.map(course => (
                  <tr key={course.id} className="hover:bg-brand-light/10 transition">
                    <td className="px-6 py-4 font-bold text-brand-dark">{course.title}</td>
                    <td className="px-6 py-4">{course.category}</td>
                    <td className="px-6 py-4">{course.durationHours} hrs</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link href={`/admin-panel/capacitaciones/editar/${course.slug}`} className="text-xs font-bold text-brand-teal hover:underline mr-3">Editar</Link>
                      <button onClick={() => { openCreateModal(); setTab('SESIONES'); }} className="text-xs font-bold bg-brand-teal/10 text-brand-teal px-2 py-1 rounded mr-3">Agendar</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="text-xs font-bold text-red-500 hover:text-red-700 align-middle" title="Eliminar curso">
                        <Trash2 size={16} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'SESIONES' && (
        <>
          <div className="mb-4">
            <button onClick={openCreateModal} className="w-full md:w-auto bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition">
              + Nueva Fecha
            </button>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Curso</th>
                  <th className="px-6 py-3">Fecha Inicio</th>
                  <th className="px-6 py-3">Modalidad</th>
                  <th className="px-6 py-3">Cupos</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map(session => (
                  <tr key={session.id} className="hover:bg-brand-light/10 transition">
                    <td className="px-6 py-4 font-bold text-brand-dark">{courses.find(c => c.slug === session.courseSlug)?.title || session.courseSlug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{format(toDateOnly(session.startDate), 'dd MMM yyyy', { locale: es })}</td>
                    <td className="px-6 py-4">{session.modality}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.seatsTaken} / {session.seatsTotal}
                      {session.seatsTaken >= session.seatsTotal && <span className="ml-2 text-xs text-red-500 font-bold">(Agotado)</span>}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(session.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-nowrap items-center gap-1">
                        <Link href={`/admin-panel/capacitaciones/sesiones/${session.id}/inscritos`} className="p-1.5 text-brand-dark hover:bg-brand-dark/10 rounded" title="Ver inscritos">
                          <UsersIcon size={15} />
                        </Link>
                        <button onClick={() => setShareSession(session)} className="p-1.5 text-brand-teal hover:bg-brand-teal/10 rounded" title="Compartir link de inscripción">
                          <Share2 size={15} />
                        </button>
                        <button onClick={() => openEditModal(session)} className="p-1.5 text-brand-teal hover:bg-brand-teal/10 rounded" title="Editar sesión">
                          <Pencil size={15} />
                        </button>
                        {session.status === 'ABIERTA' && (
                          <button onClick={() => handleActionSession(session.id, 'close')} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Cerrar inscripciones">
                            <XCircle size={15} />
                          </button>
                        )}
                        {session.status !== 'FINALIZADA' && (
                          <button onClick={() => handleActionSession(session.id, 'finish')} className="p-1.5 text-brand-teal hover:bg-brand-teal/10 rounded" title="Finalizar sesión">
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button onClick={() => handleDeleteSession(session.id)} className="p-1.5 text-red-500 hover:bg-red-100 rounded" title="Eliminar sesión">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">{editingSession ? 'Editar Sesión' : 'Programar Nueva Sesión'}</h3>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmitSession} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Curso</label>
                <select name="courseSlug" required defaultValue={editingSession?.courseSlug || ''} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                  <option value="">Selecciona curso...</option>
                  {courses.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">Fecha Inicio</label>
                  <input type="date" name="startDate" required defaultValue={editingSession ? new Date(editingSession.startDate).toISOString().slice(0, 10) : undefined} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">Fecha Fin (Opcional)</label>
                  <input type="date" name="endDate" defaultValue={editingSession?.endDate ? new Date(editingSession.endDate).toISOString().slice(0, 10) : undefined} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">Modalidad</label>
                  <select name="modality" required defaultValue={editingSession?.modality || 'PRESENCIAL'} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="ONLINE_VIVO">Online en Vivo</option>
                    <option value="IN_COMPANY">In-Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">Cupos Totales</label>
                  <input type="number" name="seatsTotal" required min="1" max="100" defaultValue={editingSession?.seatsTotal ?? 15} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Ubicación (Opcional)</label>
                <input type="text" name="location" defaultValue={editingSession?.location || ''} placeholder="Ej: Centro de Capacitación Rancagua" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-light">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingSession(null); }} className="px-4 py-2 text-sm text-brand-grey hover:bg-brand-light rounded transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-brand-teal text-white rounded hover:bg-brand-dark transition disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {shareSession && (
        <ShareSessionModal
          session={shareSession}
          courseTitle={courses.find(c => c.slug === shareSession.courseSlug)?.title || shareSession.courseSlug}
          copiedId={copiedId}
          onCopy={handleCopyLink}
          onClose={() => setShareSession(null)}
        />
      )}
    </div>
  );
}

function ShareSessionModal({ session, courseTitle, copiedId, onCopy, onClose }: {
  session: CourseSession;
  courseTitle: string;
  copiedId: string | null;
  onCopy: (sessionId: string) => void;
  onClose: () => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState('');

  const link = typeof window !== 'undefined' ? `${window.location.origin}/capacitaciones/inscripcion/${session.id}` : '';

  React.useEffect(() => {
    let active = true;
    getEnrollmentLinkQr(session.id).then(res => {
      if (!active) return;
      if (res.success && res.qrDataUrl) {
        setQrDataUrl(res.qrDataUrl);
      } else {
        setQrError(res.error || 'No se pudo generar el QR');
      }
      setQrLoading(false);
    });
    return () => { active = false; };
  }, [session.id]);

  const mailSubject = encodeURIComponent(`Ficha de inscripción: ${courseTitle}`);
  const mailBody = encodeURIComponent(`Hola,\n\nTe compartimos el link para inscribirte en "${courseTitle}":\n${link}\n\nSaludos,\nF&D Ingeniería`);

  return (
    <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-grey hover:text-brand-dark" title="Cerrar">
          <X size={18} />
        </button>
        <h3 className="text-lg font-bold font-heading text-brand-dark mb-1">Compartir inscripción</h3>
        <p className="text-xs text-brand-grey mb-4">{courseTitle}</p>

        <div className="flex items-center gap-2 mb-4">
          <input readOnly value={link} className="flex-1 border border-brand-grey/30 rounded px-3 py-2 text-xs bg-brand-light/30 truncate" />
          <button onClick={() => onCopy(session.id)} className="shrink-0 p-2 bg-brand-teal/10 text-brand-teal rounded hover:bg-brand-teal/20" title="Copiar link">
            {copiedId === session.id ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <a
          href={`mailto:?subject=${mailSubject}&body=${mailBody}`}
          className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white font-bold py-2.5 rounded hover:bg-brand-teal transition mb-4 text-sm"
        >
          <Mail size={16} /> Enviar por correo
        </a>

        <div className="border-t border-brand-light pt-4 flex flex-col items-center">
          <p className="text-xs font-bold text-brand-grey uppercase mb-3">Código QR</p>
          {qrLoading && <Loader2 size={28} className="animate-spin text-brand-teal" />}
          {qrError && <p className="text-xs text-red-500">{qrError}</p>}
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt={`QR de inscripción para ${courseTitle}`} className="w-40 h-40" />
          )}
        </div>
      </div>
    </div>
  );
}
