import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { PrintButton } from './PrintButton';

export default async function PrintableQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quotation.findUnique({ where: { id } });

  if (!quote) notFound();

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-brand-dark flex flex-col">
      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="font-bold text-xl text-brand-dark flex items-center gap-3">
            <span>Cotización #{quote.quoteNumber}</span>
            <span className="bg-brand-light/30 text-brand-teal text-xs px-2 py-1 rounded border border-brand-teal/20">
              {quote.clientType === 'SERVICIO' ? 'Servicio Industrial' : quote.clientType === 'CAPACITACION' ? 'Capacitación' : quote.clientType}
            </span>
          </h1>
          <p className="text-sm text-brand-grey mt-1">Para: {quote.clientName} {quote.clientCompany ? `(${quote.clientCompany})` : ''}</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/admin-panel/cotizaciones" className="text-brand-grey hover:text-brand-teal transition font-medium border border-gray-300 px-4 py-2 rounded-md bg-gray-50">
            &larr; Volver
          </a>
          <PrintButton id={id} />
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-[#525659] overflow-hidden">
        <iframe 
          src={`/api/cotizaciones/${id}/pdf`} 
          className="w-full min-h-[calc(100vh-85px)] border-0"
          title={`Cotizacion_${quote.quoteNumber}.pdf`}
        />
      </div>
    </div>
  );
}
