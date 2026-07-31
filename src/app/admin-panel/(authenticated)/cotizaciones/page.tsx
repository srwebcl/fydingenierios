import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Plus, FileText, ExternalLink, Calendar, User, Briefcase, Mail, Building } from 'lucide-react';
import { DeleteQuotationButton } from './DeleteQuotationButton';
import { SendQuotationEmailButton } from '@/components/admin/SendQuotationEmailButton';

export const dynamic = 'force-dynamic';

export default async function CotizacionesPage() {
  const cotizaciones = await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-light">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark font-heading">Cotizaciones Comerciales</h1>
          <p className="text-brand-grey mt-2">Gestione y envíe propuestas técnico-comerciales en formato PDF.</p>
        </div>
        <Link 
          href="/admin-panel/cotizaciones/nueva" 
          className="bg-brand-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg flex items-center shrink-0"
        >
          <Plus size={20} className="mr-2" />
          Nueva Cotización
        </Link>
      </div>

      {/* Grid of Quotes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {cotizaciones.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-dashed border-brand-grey/30 text-brand-grey">
            <FileText size={48} className="mx-auto text-brand-light mb-4" />
            <h3 className="text-xl font-bold text-brand-dark mb-2">Sin Cotizaciones</h3>
            <p>Aún no se ha generado ninguna cotización.</p>
          </div>
        ) : (
          cotizaciones.map((cotizacion) => (
            <div key={cotizacion.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-brand-light transition-all flex flex-col overflow-hidden group">
              
              {/* Header Card */}
              <div className="bg-brand-light/20 p-5 border-b border-brand-light flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-1.5 font-mono font-bold text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-md text-sm mb-2">
                    <FileText size={14} />
                    {cotizacion.quoteNumber}
                  </span>
                  <h3 className="font-bold text-brand-dark text-lg line-clamp-1" title={cotizacion.serviceName}>
                    {cotizacion.serviceName}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-brand-dark">
                    ${cotizacion.total.toLocaleString('es-CL')}
                  </div>
                  <div className="text-xs font-bold text-brand-grey mt-1 bg-white px-2 py-0.5 rounded border border-brand-light inline-block">
                    {cotizacion.clientType}
                  </div>
                </div>
              </div>

              {/* Body Card */}
              <div className="p-5 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar size={16} className="text-brand-grey shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-brand-dark">Fecha Emisión</div>
                      <div className="text-brand-grey">{new Date(cotizacion.date).toLocaleDateString('es-CL')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Briefcase size={16} className="text-brand-grey shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-brand-dark">Validez</div>
                      <div className="text-brand-grey">{cotizacion.validityDays} días</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-brand-light pt-4 sm:pt-0 sm:pl-4">
                  <div className="flex items-start gap-2 text-sm">
                    <User size={16} className="text-brand-grey shrink-0 mt-0.5" />
                    <div className="truncate">
                      <div className="font-bold text-brand-dark truncate" title={cotizacion.clientName}>{cotizacion.clientName}</div>
                      <div className="text-brand-grey flex items-center gap-1 truncate" title={cotizacion.clientCompany || 'Persona Natural'}>
                        <Building size={12} /> {cotizacion.clientCompany || 'Independiente'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm truncate" title={cotizacion.clientEmail}>
                    <Mail size={16} className="text-brand-teal shrink-0" />
                    <span className="text-brand-teal truncate">{cotizacion.clientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-brand-light/30 border-t border-brand-light flex justify-between items-center">
                <SendQuotationEmailButton id={cotizacion.id} />
                
                <div className="flex gap-2">
                  <Link
                    href={`/admin-panel/cotizaciones/${cotizacion.id}`}
                    target="_blank"
                    className="p-2 text-brand-dark bg-white hover:bg-brand-light hover:text-brand-teal rounded-md transition-colors flex items-center gap-2 text-sm font-medium border border-brand-light shadow-sm"
                    title="Ver PDF"
                  >
                    <ExternalLink size={18} />
                    <span className="hidden sm:inline">Ver / Imprimir</span>
                  </Link>
                  <DeleteQuotationButton id={cotizacion.id} />
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
