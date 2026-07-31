import React from 'react';
import { prisma as db } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { DeleteServiceButton } from '@/components/admin/DeleteServiceButton';

export const metadata: Metadata = {
  title: 'Servicios Web | F&D Admin',
};

export const dynamic = 'force-dynamic';

export default async function ServiciosAdminPage() {
  const services = await db.service.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Portafolio de Servicios</h2>
        <Link href="/admin-panel/servicios/nuevo" className="w-full md:w-auto bg-brand-teal text-white px-4 py-2 rounded shadow hover:bg-brand-dark transition flex items-center justify-center gap-2">
          <PlusCircle size={18} /> Agregar Servicio
        </Link>
      </div>
      
      <p className="text-brand-grey mb-6">
        Estos son los servicios activos que se muestran en el sitio web y a los cuales se pueden asociar los Informes Técnicos emitidos.
      </p>

      <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Servicio</th>
              <th className="px-6 py-3">Descripción Breve</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-brand-grey">No hay servicios registrados</td></tr>
            ) : services.map((info) => (
              <tr key={info.slug} className="hover:bg-brand-light/10 transition">
                <td className="px-6 py-4 font-bold text-brand-dark w-2/5">{info.title}</td>
                <td className="px-6 py-4 w-2/5">
                  <p className="text-brand-grey line-clamp-2" title={info.shortDescription}>
                    {info.shortDescription}
                  </p>
                </td>
                <td className="px-6 py-4 text-right w-1/5">
                  <div className="flex justify-end gap-4 items-center">
                    <Link 
                      href={`/admin-panel/servicios/editar/${info.slug}`} 
                      className="text-xs font-bold text-brand-teal hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteServiceButton slug={info.slug} title={info.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
