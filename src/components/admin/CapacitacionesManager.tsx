'use client';

import React, { useState } from 'react';
import { CourseSession, Modality, SessionStatus } from '@prisma/client';
import { createCourseSession, closeCourseSession, finishCourseSession } from '@/actions/capacitaciones';
import { courses } from '@/content/courses';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  initialSessions: CourseSession[];
}

export default function CapacitacionesManager({ initialSessions }: Props) {
  const [sessions, setSessions] = useState<CourseSession[]>(initialSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await createCourseSession(formData);
    
    if (res.success && res.session) {
      setSessions([res.session, ...sessions]);
      setIsModalOpen(false);
    } else {
      setError(res.error || 'Error desconocido');
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'close' | 'finish') => {
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

  const getStatusBadge = (status: SessionStatus) => {
    const styles = {
      ABIERTA: 'bg-brand-lime text-brand-dark',
      CUPOS_LIMITADOS: 'bg-yellow-400 text-yellow-900',
      CERRADA: 'bg-brand-grey text-white',
      FINALIZADA: 'bg-brand-dark text-brand-teal'
    };
    return <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>{status}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Gestor de Capacitaciones</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition"
        >
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
          <tbody>
            {sessions.map(session => (
              <tr key={session.id} className="border-b border-brand-light/50 hover:bg-brand-light/20">
                <td className="px-6 py-4 font-bold text-brand-dark">{courses.find(c => c.slug === session.courseSlug)?.title || session.courseSlug}</td>
                <td className="px-6 py-4">{format(new Date(session.startDate), 'dd MMM yyyy', { locale: es })}</td>
                <td className="px-6 py-4">{session.modality}</td>
                <td className="px-6 py-4">
                  {session.seatsTaken} / {session.seatsTotal}
                  {session.seatsTaken >= session.seatsTotal && <span className="ml-2 text-xs text-red-500 font-bold">(Agotado)</span>}
                </td>
                <td className="px-6 py-4">{getStatusBadge(session.status)}</td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  {session.status === 'ABIERTA' && (
                    <button onClick={() => handleAction(session.id, 'close')} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">Cerrar</button>
                  )}
                  {session.status !== 'FINALIZADA' && (
                    <button onClick={() => handleAction(session.id, 'finish')} className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-1 rounded hover:bg-brand-teal/20">Finalizar</button>
                  )}
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brand-grey">No hay sesiones creadas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Sesión */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-dark">Crear Nueva Sesión</h3>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Curso</label>
                <select name="courseSlug" required className="w-full border border-brand-grey/30 rounded px-3 py-2">
                  <option value="">Selecciona un curso...</option>
                  {courses.map(c => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Modalidad</label>
                <select name="modality" required className="w-full border border-brand-grey/30 rounded px-3 py-2">
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="ONLINE_VIVO">Online en Vivo</option>
                  <option value="IN_COMPANY">In-Company</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">Fecha Inicio</label>
                  <input type="date" name="startDate" required className="w-full border border-brand-grey/30 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1">Fecha Fin (Opcional)</label>
                  <input type="date" name="endDate" className="w-full border border-brand-grey/30 rounded px-3 py-2" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Lugar / Ciudad (Opcional)</label>
                <input type="text" name="location" className="w-full border border-brand-grey/30 rounded px-3 py-2" placeholder="Ej: Rancagua" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Cupos Totales</label>
                <input type="number" name="seatsTotal" min="1" required defaultValue="10" className="w-full border border-brand-grey/30 rounded px-3 py-2" />
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-light">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-brand-grey hover:bg-brand-light rounded transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-teal text-white rounded hover:bg-brand-dark transition disabled:opacity-50">
                  {loading ? 'Creando...' : 'Crear Sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
