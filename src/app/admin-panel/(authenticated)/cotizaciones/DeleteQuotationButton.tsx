'use client'

import React, { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteQuotation } from '@/actions/cotizaciones';

export function DeleteQuotationButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cotización? Esta acción no se puede deshacer.')) {
      startTransition(async () => {
        const res = await deleteQuotation(id);
        if (!res.success) {
          alert('Error al eliminar la cotización');
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-brand-grey hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Eliminar"
    >
      <Trash2 size={18} />
    </button>
  );
}
