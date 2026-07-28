import React from 'react';
import { prisma as db } from '@/lib/db';
import LeadsManager from '@/components/admin/LeadsManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bandeja de Leads | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full">
      <LeadsManager initialLeads={leads} />
    </div>
  );
}
