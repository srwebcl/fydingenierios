'use client';

import React, { useState } from 'react';
import { Lead, LeadStatus, InterestType } from '@prisma/client';
import { updateLeadStatus } from '@/actions/leads';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  initialLeads: Lead[];
}

export default function LeadsManager({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'TODOS'>('TODOS');
  const [interestFilter, setInterestFilter] = useState<InterestType | 'TODOS'>('TODOS');

  const filteredLeads = leads.filter(l => 
    (statusFilter === 'TODOS' || l.status === statusFilter) &&
    (interestFilter === 'TODOS' || l.interestType === interestFilter)
  );

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    const res = await updateLeadStatus(id, newStatus);
    if (res.success) {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } else {
      alert(res.error);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    const styles = {
      NUEVO: 'bg-brand-lime text-brand-dark',
      CONTACTADO: 'bg-blue-100 text-blue-700',
      COTIZADO: 'bg-purple-100 text-purple-700',
      GANADO: 'bg-green-100 text-green-700',
      PERDIDO: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">Bandeja de Leads</h2>
        
        <div className="flex gap-4">
          <select 
            value={interestFilter} 
            onChange={(e) => setInterestFilter(e.target.value as any)}
            className="border border-brand-grey/30 rounded px-3 py-2 text-sm"
          >
            <option value="TODOS">Todas las Áreas</option>
            {Object.values(InterestType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-brand-grey/30 rounded px-3 py-2 text-sm"
          >
            <option value="TODOS">Todos los Estados</option>
            {Object.values(LeadStatus).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-brand-light text-brand-grey font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Contacto</th>
              <th className="px-6 py-3">Área de Interés</th>
              <th className="px-6 py-3">Mensaje</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="border-b border-brand-light/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-brand-dark">{lead.name}</div>
                  <div className="text-xs text-brand-grey">{lead.company || 'Sin Empresa'}</div>
                  <div className="text-xs">{lead.email}</div>
                  <div className="text-xs">{lead.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold">{lead.interestType}</span>
                  {lead.interestSlug && <div className="text-xs text-brand-teal">{lead.interestSlug}</div>}
                  {lead.source && <div className="text-[10px] text-brand-grey mt-1">Ref: {lead.source}</div>}
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={lead.message}>
                  {lead.message}
                </td>
                <td className="px-6 py-4">
                  {format(new Date(lead.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer ${getStatusColor(lead.status)}`}
                  >
                    {Object.values(LeadStatus).map(s => (
                      <option key={s} value={s} className="bg-white text-brand-dark">{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-grey">No hay leads que coincidan con los filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
