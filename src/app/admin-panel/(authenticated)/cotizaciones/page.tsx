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

      {/* List of Quotes */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-light overflow-hidden">
        {cotizaciones.length === 0 ? (
          <div className="p-12 text-center text-brand-grey">
            <FileText size={48} className="mx-auto text-brand-light mb-4" />
            <h3 className="text-xl font-bold text-brand-dark mb-2">Sin Cotizaciones</h3>
            <p>Aún no se ha generado ninguna cotización.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-brand-light/30 border-b border-brand-light text-brand-grey text-sm">
                  <th className="p-4 font-bold">Nº Cotización</th>
                  <th className="p-4 font-bold">Fecha / Validez</th>
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Servicio</th>
                  <th className="p-4 font-bold text-right">Total</th>
                  <th className="p-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {cotizaciones.map((cotizacion) => (
                  <tr key={cotizacion.id} className="hover:bg-brand-light/30 transition group">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-brand-teal bg-brand-teal/10 px-2 py-1 rounded-md text-sm">
                        {cotizacion.quoteNumber}
                      </span>
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">
                      <div className="font-medium text-brand-dark">{new Date(cotizacion.date).toLocaleDateString('es-CL')}</div>
                      <div className="text-brand-grey text-xs mt-0.5">{cotizacion.validityDays} días validez</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-brand-dark text-sm">{cotizacion.clientName}</div>
                      <div className="text-brand-grey text-xs flex items-center gap-1 mt-0.5">
                        <Building size={12} className="shrink-0" /> <span className="truncate max-w-[150px]">{cotizacion.clientCompany || 'Independiente'}</span>
                      </div>
                      <div className="text-brand-teal text-xs flex items-center gap-1 mt-0.5">
                        <Mail size={12} className="shrink-0" /> <span className="truncate max-w-[150px]">{cotizacion.clientEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-brand-dark text-sm line-clamp-2 max-w-[200px]" title={cotizacion.serviceName}>
                        {cotizacion.serviceName}
                      </div>
                      <div className="text-[10px] font-bold text-brand-grey mt-1 bg-white px-2 py-0.5 rounded border border-brand-light inline-block uppercase">
                        {cotizacion.clientType}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="font-bold text-brand-dark">
                        ${cotizacion.total.toLocaleString('es-CL')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <SendQuotationEmailButton id={cotizacion.id} />
                        <Link
                          href={`/admin-panel/cotizaciones/${cotizacion.id}`}
                          target="_blank"
                          className="p-2 text-brand-dark bg-white hover:bg-brand-light hover:text-brand-teal rounded-md transition-colors border border-brand-light shadow-sm"
                          title="Ver / Imprimir PDF"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <DeleteQuotationButton id={cotizacion.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
