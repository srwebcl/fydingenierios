import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PrintButton } from './PrintButton';

export default async function PrintableQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quotation.findUnique({ where: { id } });

  if (!quote) notFound();

  // Parse items from JSON
  const items: any[] = typeof quote.items === 'string' ? JSON.parse(quote.items as string) : quote.items;

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:py-0 print:min-h-0 font-sans text-brand-dark">
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="max-w-[21cm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <a href="/admin-panel/cotizaciones" className="text-brand-grey hover:text-brand-teal transition font-medium">
          &larr; Volver
        </a>
        <PrintButton />
      </div>

      {/* A4 Document Container */}
      <div className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-xl print:shadow-none print:min-h-0 print:max-w-none relative box-border overflow-visible">
        
        {/* Top Decorative Bar */}
        <div className="h-3 w-full bg-gradient-to-r from-brand-lime to-brand-teal"></div>

        <div className="p-12 h-full flex flex-col">
          
          {/* HEADER ROW */}
          <div className="flex justify-between items-start mb-12">
            {/* Logo */}
            <div className="w-1/3">
              <Image src="/logo.jpeg" alt="F&D Ingeniería" width={180} height={80} className="w-full max-w-[180px] object-contain" />
            </div>
            
            {/* Title & Info */}
            <div className="w-1/3 text-right">
              <h1 className="font-bold text-3xl text-brand-dark tracking-tight mb-2">COTIZACIÓN</h1>
              <div className="text-sm text-brand-grey">
                <div className="flex justify-end gap-2 font-medium">
                  <span>N°:</span>
                  <span className="text-brand-dark">{quote.quoteNumber}</span>
                </div>
                <div className="flex justify-end gap-2 font-medium mt-1">
                  <span>FECHA:</span>
                  <span className="text-brand-dark">{new Date(quote.date).toLocaleDateString('es-CL')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
            
            {/* CLIENT (A:) */}
            <div className="bg-brand-light/30 rounded-xl p-5 border border-brand-light">
              <h3 className="font-bold text-brand-teal mb-3 uppercase tracking-wider text-xs">Preparado Para</h3>
              <div className="space-y-2">
                <div className="font-bold text-lg text-brand-dark">{quote.clientName}</div>
                {quote.clientType === 'EMPRESA' && (
                  <div className="text-brand-grey font-medium">{quote.clientCompany}</div>
                )}
                <div className="text-brand-grey">{quote.clientPhone}</div>
                <div><a href={`mailto:${quote.clientEmail}`} className="text-brand-teal">{quote.clientEmail}</a></div>
              </div>
            </div>

            {/* SENDER (DE:) */}
            <div className="bg-brand-light/30 rounded-xl p-5 border border-brand-light">
              <h3 className="font-bold text-brand-teal mb-3 uppercase tracking-wider text-xs">Emitido Por</h3>
              <div className="space-y-2">
                <div className="font-bold text-lg text-brand-dark">{quote.senderName}</div>
                <div className="text-brand-grey font-medium">{quote.senderCompany}</div>
                <div className="text-brand-grey">RUT: {quote.senderRut}</div>
                <div className="text-brand-grey">{quote.senderAddress}</div>
                <div><a href={`mailto:${quote.senderEmail}`} className="text-brand-teal">{quote.senderEmail}</a></div>
              </div>
            </div>

          </div>

          {/* SERVICE TITLE HIGHLIGHT */}
          <div className="mb-8">
            <p className="text-brand-grey mb-2">De acuerdo con vuestra solicitud, enviamos cotización por los siguientes servicios:</p>
            <div className="bg-brand-dark text-white p-4 rounded-lg font-bold text-lg">
              {quote.serviceName}
            </div>
          </div>

          {/* REQUIREMENTS SECTION */}
          <div className="mb-8">
            <h3 className="font-bold text-brand-dark mb-2 border-b-2 border-brand-light pb-2">Descripción del Requerimiento</h3>
            <div className="text-brand-grey whitespace-pre-wrap leading-relaxed">{quote.requirements}</div>
          </div>

          {/* TERMS AND PAYMENT */}
          <div className="flex gap-8 mb-8 text-sm">
            <div className="flex-1 bg-brand-light/20 p-5 rounded-xl border border-brand-light">
              <span className="block font-bold text-brand-teal mb-2 uppercase tracking-wide text-xs">Vigencia de la Oferta</span>
              <span className="text-brand-dark font-medium text-lg">{quote.validityDays} días</span>
            </div>
            <div className="flex-1 bg-brand-light/20 p-5 rounded-xl border border-brand-light">
              <span className="block font-bold text-brand-teal mb-2 uppercase tracking-wide text-xs">Modalidad de Pago</span>
              <span className="text-brand-dark font-medium">{quote.paymentTerms}</span>
            </div>
          </div>

          {/* ECONOMIC OFFER TABLE */}
          <div className="mb-8">
            <h3 className="font-bold text-brand-dark mb-4 text-lg">Oferta Económica</h3>
            <div className="rounded-xl overflow-hidden border border-brand-light">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-teal text-white">
                    <th className="py-3 px-4 font-bold w-12 text-center">N°</th>
                    <th className="py-3 px-4 font-bold">Detalle del Servicio</th>
                    <th className="py-3 px-4 font-bold text-center w-20">Cant.</th>
                    <th className="py-3 px-4 font-bold text-center w-24">Unidad</th>
                    <th className="py-3 px-4 font-bold text-right w-32">Valor Unit.</th>
                    <th className="py-3 px-4 font-bold text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light">
                  {items.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-light/10'}>
                      <td className="py-3 px-4 text-center font-medium text-brand-grey">{i + 1}</td>
                      <td className="py-3 px-4 font-bold text-brand-dark">{item.detail}</td>
                      <td className="py-3 px-4 text-center text-brand-dark">{item.quantity}</td>
                      <td className="py-3 px-4 text-center text-brand-grey">{item.unit}</td>
                      <td className="py-3 px-4 text-right text-brand-grey">${item.unitPrice.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-4 text-right font-bold text-brand-dark">${item.total.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOTALS AND FOOTER */}
          <div className="flex justify-between items-end mt-auto pt-8">
            {/* Bank Details (Left side) */}
            <div className="w-1/2">
              {quote.clientType === 'EMPRESA' && (
                <div className="text-sm text-brand-grey bg-brand-light/20 p-4 rounded-lg border border-brand-light">
                  <div className="font-bold text-brand-dark mb-2">Datos Bancarios para Transferencia</div>
                  <div className="grid grid-cols-[100px_1fr] gap-y-1">
                    <span className="font-medium">Razón Social:</span> <span>F&D Ingeniería en Mantenimiento SpA</span>
                    <span className="font-medium">RUT:</span> <span>78.243.503-5</span>
                    <span className="font-medium">Banco:</span> <span>Banco de Chile</span>
                    <span className="font-medium">Tipo:</span> <span>Cuenta Vista</span>
                    <span className="font-medium">N° Cuenta:</span> <span>00-004-37252-65</span>
                    <span className="font-medium">Correo:</span> <span>contacto@fydingenieria.cl</span>
                  </div>
                </div>
              )}
            </div>

            {/* Totals Table (Right side) */}
            <div className="w-1/3">
              <div className="border-t-2 border-brand-dark pt-4">
                <div className="flex justify-between text-brand-grey mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-dark">${quote.subtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-brand-grey mb-3">
                  <span>IVA {quote.clientType === 'PERSONA' ? '(0%)' : '(19%)'}</span>
                  <span className="font-medium text-brand-dark">${quote.iva.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-brand-teal pt-3 border-t border-brand-light">
                  <span>Total</span>
                  <span>${quote.total.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Decorative Bar */}
        <div className="absolute bottom-0 left-0 w-full text-center py-4 bg-brand-dark text-white text-xs opacity-90">
          DOCUMENTO GENERADO OFICIALMENTE POR F&D INGENIERÍA EN MANTENIMIENTO SPA | WWW.FYDINGENIERIA.CL
        </div>
      </div>
    </div>
  );
}
