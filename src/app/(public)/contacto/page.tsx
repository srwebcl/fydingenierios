'use client';

import React, { useState } from 'react';
import { sendContactFormEmail } from '@/actions/contacto';
import toast from 'react-hot-toast';

export default function Contacto() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (honeypot) {
      console.log('Bot detectado.');
      setStatus('loading');
      setTimeout(() => {
        setStatus('success');
        toast.success('Mensaje enviado exitosamente');
      }, 1000);
      return;
    }

    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      reason: formData.get('reason') as string,
      message: formData.get('message') as string,
    };

    const result = await sendContactFormEmail(data);
    
    if (result.success) {
      setStatus('success');
      toast.success('Mensaje enviado exitosamente');
      import('@next/third-parties/google').then(({ sendGAEvent }) => {
        sendGAEvent('event', 'conversion', { 'send_to': 'AW-18371400854/135dCJqnsN0cEJaplbhE' });
      });
    } else {
      setStatus('error');
      toast.error('Error: ' + (result.error || 'No se pudo enviar'));
    }
  };

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-brand-dark mb-4">Contacto y Cotizaciones</h1>
        <p className="text-brand-grey text-lg">Complete el formulario y nuestro equipo técnico se pondrá en contacto a la brevedad.</p>
      </div>

      <div className="bg-brand-white p-8 md:p-10 rounded-xl shadow-lg border border-brand-light">
        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-brand-lime/20 text-brand-lime rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Mensaje Enviado</h2>
            <p className="text-brand-grey">Gracias por contactarnos. Le responderemos pronto.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 text-brand-teal font-bold hover:underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Honeypot */}
            <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
              <label htmlFor="contacto-website">Website</label>
              <input type="text" id="contacto-website" name="contacto-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Nombre Completo *</label>
                <input required type="text" name="fullName" className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Empresa</label>
                <input type="text" name="company" className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Correo Electrónico *</label>
                <input required type="email" name="email" className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Teléfono *</label>
                <input required type="tel" name="phone" className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Motivo de Consulta *</label>
              <select required name="reason" className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal bg-white">
                <option value="">Seleccione una opción</option>
                <option value="Servicio de Mantenimiento">Servicio de Mantenimiento / Predictivo</option>
                <option value="Capacitacion">Capacitación Industrial</option>
                <option value="Ingeniería de Confiabilidad">Ingeniería de Confiabilidad</option>
                <option value="Otro">Otra consulta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Mensaje *</label>
              <textarea required name="message" rows={4} className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal resize-none"></textarea>
            </div>

            <div className="flex items-start mb-6">
              <input type="checkbox" required className="mt-1 mr-3" id="privacy" />
              <label htmlFor="privacy" className="text-sm text-brand-grey">
                Acepto las <a href="/privacidad" className="text-brand-teal underline">políticas de privacidad</a> y el tratamiento de mis datos para ser contactado.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-brand-teal text-white font-bold py-4 rounded hover:bg-brand-dark transition-colors disabled:opacity-70"
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
