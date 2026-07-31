import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QuotationWizard } from '@/components/admin/QuotationWizard';

export default function NuevaCotizacionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin-panel/cotizaciones" 
          className="inline-flex items-center text-brand-grey hover:text-brand-teal transition-colors font-medium mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a Cotizaciones
        </Link>
        <h1 className="text-3xl font-bold text-brand-dark">Crear Nueva Cotización</h1>
        <p className="text-brand-grey mt-1">Completa los pasos para generar un nuevo documento PDF.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-brand-light p-6 md:p-8">
        <QuotationWizard />
      </div>
    </div>
  );
}
