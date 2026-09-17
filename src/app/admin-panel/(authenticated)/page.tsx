import React from 'react';
import { prisma as db } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toDateOnly } from '@/lib/date';

export const metadata: Metadata = {
  title: 'Dashboard | F&D Admin',
};

export const dynamic = 'force-dynamic';

const LEAD_STATUS_STYLES: Record<string, string> = {
  NUEVO: 'bg-brand-lime text-brand-dark',
  CONTACTADO: 'bg-blue-100 text-blue-700',
  COTIZADO: 'bg-purple-100 text-purple-700',
  GANADO: 'bg-green-100 text-green-700',
  PERDIDO: 'bg-red-100 text-red-700',
};

const SESSION_STATUS_STYLES: Record<string, string> = {
  ABIERTA: 'bg-brand-lime text-brand-dark',
  CUPOS_LIMITADOS: 'bg-yellow-400 text-yellow-900',
  CERRADA: 'bg-brand-grey text-white',
  FINALIZADA: 'bg-brand-dark text-brand-teal',
};

export default async function AdminDashboard() {
  const [totalLeads, totalCredentials, activeSessions, totalEnrollments, recentLeads, upcomingSessions, courses] = await Promise.all([
    db.lead.count(),
    db.credential.count(),
    db.courseSession.count({ where: { status: 'ABIERTA' } }),
    db.enrollment.count(),
    db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    db.courseSession.findMany({ where: { status: { in: ['ABIERTA', 'CUPOS_LIMITADOS'] } }, orderBy: { startDate: 'asc' }, take: 6 }),
    db.course.findMany({ select: { slug: true, title: true } }),
  ]);

  const courseTitle = (slug: string) => courses.find(c => c.slug === slug)?.title || slug;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">Resumen del Sistema</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-brand-light">
          <h3 className="text-sm font-bold text-brand-grey uppercase">Leads Recibidos</h3>
          <p className="text-4xl font-heading font-bold text-brand-teal mt-2">{totalLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-brand-light">
          <h3 className="text-sm font-bold text-brand-grey uppercase">Credenciales Emitidas</h3>
          <p className="text-4xl font-heading font-bold text-brand-teal mt-2">{totalCredentials}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-brand-light">
          <h3 className="text-sm font-bold text-brand-grey uppercase">Capacitaciones Abiertas</h3>
          <p className="text-4xl font-heading font-bold text-brand-teal mt-2">{activeSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-brand-light">
          <h3 className="text-sm font-bold text-brand-grey uppercase">Inscritos Totales</h3>
          <p className="text-4xl font-heading font-bold text-brand-teal mt-2">{totalEnrollments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-brand-light overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-light">
            <h3 className="font-bold text-brand-dark">Leads Recientes</h3>
            <Link href="/admin-panel/leads" className="text-xs font-bold text-brand-teal hover:underline">Ver todos</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-6 py-8 text-center text-brand-grey text-sm">Aún no hay leads registrados.</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <tbody className="divide-y divide-gray-200">
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-brand-light/10 transition">
                    <td className="px-6 py-3">
                      <div className="font-bold text-brand-dark">{lead.name}</div>
                      <div className="text-xs text-brand-grey">{lead.interestType === 'CAPACITACION' ? 'Capacitación' : lead.interestType === 'SERVICIO' ? 'Servicio' : 'General'}{lead.interestSlug ? `: ${lead.interestSlug}` : ''}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-brand-grey text-xs">{format(new Date(lead.createdAt), 'dd MMM yyyy', { locale: es })}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${LEAD_STATUS_STYLES[lead.status]}`}>{lead.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-brand-light overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-light">
            <h3 className="font-bold text-brand-dark">Próximas Sesiones</h3>
            <Link href="/admin-panel/capacitaciones" className="text-xs font-bold text-brand-teal hover:underline">Gestionar</Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <p className="px-6 py-8 text-center text-brand-grey text-sm">No hay sesiones programadas.</p>
          ) : (
            <table className="min-w-full text-sm text-left">
              <tbody className="divide-y divide-gray-200">
                {upcomingSessions.map(session => (
                  <tr key={session.id} className="hover:bg-brand-light/10 transition">
                    <td className="px-6 py-3">
                      <div className="font-bold text-brand-dark">{courseTitle(session.courseSlug)}</div>
                      <div className="text-xs text-brand-grey">{format(toDateOnly(session.startDate), 'dd MMM yyyy', { locale: es })}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-brand-grey text-xs">
                      {session.seatsTaken} / {session.seatsTotal} cupos
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/admin-panel/capacitaciones/sesiones/${session.id}/inscritos`} className={`px-2 py-1 rounded text-xs font-bold ${SESSION_STATUS_STYLES[session.status]}`}>
                        {session.status.replace('_', ' ')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
