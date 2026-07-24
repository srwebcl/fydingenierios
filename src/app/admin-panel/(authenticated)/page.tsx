import React from 'react';
import { prisma as db } from '@/lib/db';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | FYD Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [totalLeads, totalCredentials, activeSessions] = await Promise.all([
    db.lead.count(),
    db.credential.count(),
    db.courseSession.count({ where: { status: 'ABIERTA' } })
  ]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">Resumen del Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
