'use client';

import React, { useState } from 'react';
import { deleteService } from '@/actions/servicios';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteServiceButton({ slug, title }: { slug: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de que deseas eliminar el servicio "${title}"? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true);
      const res = await deleteService(slug);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs font-bold text-red-500 hover:text-red-700 transition disabled:opacity-50"
      title="Eliminar Servicio"
    >
      <Trash2 size={14} />
    </button>
  );
}
