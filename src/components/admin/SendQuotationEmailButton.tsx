'use client';

import React, { useState } from 'react';
import { Mail, Check, X, Loader2 } from 'lucide-react';
import { emailQuotation } from '@/actions/cotizaciones_email';
import toast from 'react-hot-toast';

export function SendQuotationEmailButton({ id }: { id: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSend = async () => {
    setStatus('loading');
    const toastId = toast.loading('Enviando cotización por correo...');
    
    try {
      const result = await emailQuotation(id);
      
      if (result.success) {
        setStatus('success');
        toast.success('Correo enviado exitosamente', { id: toastId });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        toast.error(result.error || 'Error al enviar el correo', { id: toastId });
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      setStatus('error');
      toast.error('Error de conexión', { id: toastId });
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'loading') {
    return (
      <button disabled className="p-2 text-amber-500 bg-amber-50 rounded-md flex items-center gap-2 text-sm font-medium border border-amber-200">
        <Loader2 size={18} className="animate-spin" />
        Enviando...
      </button>
    );
  }

  if (status === 'success') {
    return (
      <button disabled className="p-2 text-emerald-600 bg-emerald-50 rounded-md flex items-center gap-2 text-sm font-medium border border-emerald-200">
        <Check size={18} />
        Enviado
      </button>
    );
  }

  if (status === 'error') {
    return (
      <button onClick={handleSend} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md flex items-center gap-2 text-sm font-medium border border-red-200 transition-colors">
        <X size={18} />
        Reintentar
      </button>
    );
  }

  return (
    <button
      onClick={handleSend}
      className="p-2 text-brand-teal hover:text-white hover:bg-brand-teal rounded-md transition-colors flex items-center gap-2 text-sm font-medium border border-brand-teal"
      title="Enviar al cliente por email"
    >
      <Mail size={18} />
      Enviar Mail
    </button>
  );
}
