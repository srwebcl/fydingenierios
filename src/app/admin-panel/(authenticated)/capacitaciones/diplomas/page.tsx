import React from 'react';
import { prisma as db } from '@/lib/db';
import DiplomasManager from '@/components/admin/DiplomasManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Diplomas | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function DiplomasAdminPage() {
  const credentials = await db.credential.findMany({
    where: { type: 'DIPLOMA_CAPACITACION' },
    include: { holder: true },
    orderBy: { createdAt: 'desc' }
  });
  const courses = await db.course.findMany({
    select: { slug: true, title: true, category: true },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="w-full">
      <DiplomasManager 
        initialCredentials={credentials} 
        courses={courses}
      />
    </div>
  );
}
