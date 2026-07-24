import React from 'react';
import { prisma as db } from '@/lib/db';
import SettingsManager from '@/components/admin/SettingsManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración | FYD Admin',
};

export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
  const settings = await db.settings.findUnique({
    where: { id: 'singleton' }
  });

  return (
    <div className="w-full">
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
