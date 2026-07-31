import React from 'react';
import { Metadata } from 'next';
import { ServiceWizard } from '@/components/admin/ServiceWizard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crear Servicio | F&D Admin',
};

export default function NuevoServicioPage() {
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
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Agregar Nuevo Servicio</h2>
      </div>
      
      <div className="max-w-4xl">
        <ServiceWizard />
      </div>
    </div>
  );
}
