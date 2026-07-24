import React from 'react';
import { prisma as db } from '@/lib/db';
import CertificadosManager from '@/components/admin/CertificadosManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestor de Credenciales | FYD Admin',
};

export const dynamic = 'force-dynamic';

export default async function CertificadosAdmin() {
  const credentials = await db.credential.findMany({
    include: { holder: true },
    orderBy: { createdAt: 'desc' }
  });

  const payments = await db.credentialRecoveryPayment.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const sessions = await db.courseSession.findMany({
    orderBy: { startDate: 'desc' }
  });

  return (
    <div className="w-full">
      <CertificadosManager 
        initialCredentials={credentials} 
        initialPayments={payments} 
        sessions={sessions} 
      />
    </div>
  );
}
