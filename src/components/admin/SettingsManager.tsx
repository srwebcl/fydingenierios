'use client';

import React, { useState } from 'react';
import { Settings } from '@prisma/client';
import { updateSettings } from '@/actions/settings';

interface Props {
  initialSettings: Settings | null;
}

export default function SettingsManager({ initialSettings }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    const formData = new FormData(e.currentTarget);
    const res = await updateSettings(formData);
    
    if (res.success) {
      setMessage({ text: 'Configuración guardada exitosamente.', type: 'success' });
    } else {
      setMessage({ text: res.error || 'Error al guardar.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">Configuración Global</h2>
      
      <div className="bg-white shadow rounded-lg p-6">
        {message.text && (
          <div className={`p-4 rounded mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-brand-lime/20 text-brand-dark' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-brand-dark border-b border-brand-light pb-2 mb-4">Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Email Principal</label>
                <input 
                  type="email" 
                  name="contactEmail" 
                  required 
                  defaultValue={initialSettings?.contactEmail || 'contacto@fydingenieros.cl'} 
                  className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Número WhatsApp</label>
                <input 
                  type="text" 
                  name="whatsappNumber" 
                  required 
                  defaultValue={initialSettings?.whatsappNumber || '+56983894138'} 
                  className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" 
                  placeholder="+56912345678"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-brand-dark border-b border-brand-light pb-2 mb-4">Horario de Atención</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Apertura</label>
                <input 
                  type="time" 
                  name="businessHoursOpen" 
                  required 
                  defaultValue={initialSettings?.businessHoursOpen || '09:00'} 
                  className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Cierre</label>
                <input 
                  type="time" 
                  name="businessHoursClose" 
                  required 
                  defaultValue={initialSettings?.businessHoursClose || '18:30'} 
                  className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-brand-dark border-b border-brand-light pb-2 mb-4">Banner Principal (Ticker)</h3>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Texto de Respaldo</label>
              <p className="text-xs text-brand-grey mb-2">Este texto se mostrará moviéndose en la barra superior cuando NO existan fechas de cursos abiertas.</p>
              <textarea 
                name="tickerText" 
                required 
                rows={3}
                defaultValue={initialSettings?.tickerText || 'Especialistas en Confiabilidad de Activos y Mantenimiento Predictivo • Certificación Oficial de Informes Técnicos • Programas de Capacitación Técnica con Validación • '} 
                className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full md:w-auto bg-brand-teal text-white px-6 py-2 rounded shadow hover:bg-brand-dark transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
