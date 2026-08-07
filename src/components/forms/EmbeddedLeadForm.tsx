'use client';

import React, { useState } from 'react';

type EmbeddedLeadFormProps = {
  interestType: 'SERVICIO' | 'CAPACITACION';
  interestSlug: string;
  title?: string;
  subtitle?: string;
};

export function EmbeddedLeadForm({ interestType, interestSlug, title = "¿Necesita este servicio?", subtitle = "Cotice hoy mismo y uno de nuestros ingenieros especialistas le contactará." }: EmbeddedLeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      console.log('Bot detectado.');
      setStatus('loading');
      setTimeout(() => setStatus('success'), 1000);
      return;
    }

    setStatus('loading');
    // Simulated submission for now. Sprint 4 will connect this to real actions.
    setTimeout(() => {
      setStatus('success');
      import('@next/third-parties/google').then(({ sendGAEvent }) => {
        sendGAEvent('event', 'conversion', { 'send_to': 'AW-18371400854/135dCJqnsN0cEJaplbhE' });
      });
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="bg-brand-light border border-brand-teal p-6 rounded-xl text-center">
        <div className="w-12 h-12 bg-brand-lime/20 text-brand-lime rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="font-bold text-lg text-brand-dark mb-1">¡Solicitud Enviada!</h3>
        <p className="text-sm text-brand-grey">Hemos recibido sus datos y lo contactaremos a la brevedad.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-white border border-brand-grey/20 shadow-xl p-6 rounded-xl">
      <h3 className="font-bold text-xl text-brand-dark mb-2">{title}</h3>
      <p className="text-sm text-brand-grey mb-6">{subtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos ocultos de rastreo */}
        <input type="hidden" name="interestType" value={interestType} />
        <input type="hidden" name="interestSlug" value={interestSlug} />
        
        {/* Honeypot */}
        <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
          <label htmlFor="embedded-website">Website</label>
          <input type="text" id="embedded-website" name="embedded-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Nombre Completo *</label>
          <input required type="text" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-teal bg-brand-light" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Empresa</label>
          <input type="text" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-teal bg-brand-light" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Correo Electrónico *</label>
          <input required type="email" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-teal bg-brand-light" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Teléfono *</label>
          <input required type="tel" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-teal bg-brand-light" />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1">Mensaje / Detalle *</label>
          <textarea required rows={3} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-teal bg-brand-light" placeholder="Detalle los equipos a evaluar..."></textarea>
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full bg-brand-teal text-white font-bold py-3 rounded hover:bg-brand-dark transition-colors disabled:opacity-70 mt-2"
        >
          {status === 'loading' ? 'Procesando...' : 'Solicitar Cotización'}
        </button>
        
        <p className="text-[10px] text-brand-grey text-center mt-3">
          Tus datos están protegidos. No enviamos spam.
        </p>
      </form>
    </div>
  );
}
