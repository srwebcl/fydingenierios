import React from 'react';
import { prisma as db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ServiceWizard } from '@/components/admin/ServiceWizard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Servicio | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditarServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await db.service.findUnique({
    where: { slug }
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin-panel/servicios" 
          className="p-2 hover:bg-brand-light rounded-full transition text-brand-grey"
          title="Volver"
        >
          <ArrowLeft size={24} />
        </Link>
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Editar Servicio: {service.title}</h2>
      </div>
      
      <div className="max-w-4xl">
        <ServiceWizard initialData={service} />
      </div>
    </div>
  );
}
