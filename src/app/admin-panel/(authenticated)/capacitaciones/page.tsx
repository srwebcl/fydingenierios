import React from 'react';
import { prisma as db } from '@/lib/db';
import CapacitacionesManager from '@/components/admin/CapacitacionesManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestor de Cursos | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function CapacitacionesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const sessions = await db.courseSession.findMany({
    orderBy: { startDate: 'desc' }
  });

  return (
    <div className="w-full">
      <CapacitacionesManager initialCourses={courses} initialSessions={sessions} />
    </div>
  );
}
