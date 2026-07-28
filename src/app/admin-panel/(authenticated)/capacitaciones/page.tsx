import React from 'react';
import { prisma as db } from '@/lib/db';
import CapacitacionesManager from '@/components/admin/CapacitacionesManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestor de Capacitaciones | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function CapacitacionesPage() {
  const sessions = await db.courseSession.findMany({
    orderBy: {
      startDate: 'desc'
    }
  });

  return (
    <div className="w-full">
      <CapacitacionesManager initialSessions={sessions} />
    </div>
  );
}
