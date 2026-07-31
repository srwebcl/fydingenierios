import React from 'react';
import { prisma as db } from '@/lib/db';
import InformesManager from '@/components/admin/InformesManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informes Técnicos | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function InformesAdminPage() {
  const credentials = await db.credential.findMany({
    where: { type: 'INFORME_SERVICIO' },
    include: { holder: true },
    orderBy: { createdAt: 'desc' }
  });

  const payments = await db.credentialRecoveryPayment.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full">
      <InformesManager 
        initialCredentials={credentials} 
        initialPayments={payments} 
      />
    </div>
  );
}
