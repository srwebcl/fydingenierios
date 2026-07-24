'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Wrench, GraduationCap, FileCheck } from 'lucide-react';

type Area = 'Mantenimiento Predictivo' | 'Capacitación Industrial' | 'Calificación de Soldadores';

export function StepByStepContactForm() {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [service, setService] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSelectArea = (selectedArea: Area) => {
    setArea(selectedArea);
    setService(''); // Reset service
    setStep(2);
  };

  const getServicesForArea = (selectedArea: Area | null): string[] => {
    switch (selectedArea) {
      case 'Mantenimiento Predictivo':
        return ['Análisis de Vibraciones', 'Termografía Infrarroja', 'Alineamiento de Ejes', 'Otro Servicio de Mantenimiento'];
      case 'Capacitación Industrial':
        return ['Curso Abierto (Cupos)', 'Curso Cerrado In-Company', 'Desarrollo de Programa Específico'];
      case 'Calificación de Soldadores':
        return ['Calificación AWS D1.1', 'Calificación ASME IX', 'Calificación API 1104', 'Renovación / Mantención'];
      default:
        return [];
    }
  };

  const handleSelectService = (selectedService: string) => {
    setService(selectedService);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const resetForm = () => {
    setStep(1);
    setArea(null);
    setService('');
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="bg-brand-light border border-brand-teal p-8 md:p-12 rounded-2xl text-center max-w-2xl mx-auto shadow-xl">
        <div className="w-20 h-20 bg-brand-lime/20 text-brand-lime rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="font-bold text-2xl md:text-3xl text-brand-dark mb-4">¡Solicitud Enviada con Éxito!</h3>
        <p className="text-lg text-brand-grey mb-8">
          Hemos recibido su requerimiento para el área de <strong>{area}</strong>. 
          Uno de nuestros ingenieros se pondrá en contacto con usted a la brevedad.
        </p>
        <button 
          onClick={resetForm}
          className="text-brand-teal font-bold hover:text-brand-dark transition-colors"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-white border border-brand-grey/20 p-6 md:p-10 rounded-2xl max-w-3xl mx-auto shadow-xl">
      
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-light -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-brand-teal -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
            step >= s ? 'bg-brand-teal border-brand-teal text-white' : 'bg-brand-white border-brand-light text-brand-grey'
          }`}>
            {s}
          </div>
        ))}
      </div>

      {step > 1 && (
        <button onClick={() => setStep(step - 1)} className="flex items-center text-sm font-bold text-brand-grey hover:text-brand-teal mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Volver atrás
        </button>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-brand-dark mb-2 text-center">¿En qué área requiere apoyo técnico?</h3>
          <p className="text-brand-grey text-center mb-8">Seleccione una de nuestras divisiones de ingeniería.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleSelectArea('Mantenimiento Predictivo')}
              className="flex flex-col items-center justify-center p-6 border-2 border-brand-light rounded-xl hover:border-brand-teal hover:bg-brand-light/30 transition-all text-center group"
            >
              <Wrench size={40} className="text-brand-grey group-hover:text-brand-teal mb-4 transition-colors" />
              <span className="font-bold text-brand-dark">Mantenimiento Predictivo</span>
            </button>
            <button 
              onClick={() => handleSelectArea('Capacitación Industrial')}
              className="flex flex-col items-center justify-center p-6 border-2 border-brand-light rounded-xl hover:border-brand-teal hover:bg-brand-light/30 transition-all text-center group"
            >
              <GraduationCap size={40} className="text-brand-grey group-hover:text-brand-teal mb-4 transition-colors" />
              <span className="font-bold text-brand-dark">Capacitación Industrial</span>
            </button>
            <button 
              onClick={() => handleSelectArea('Calificación de Soldadores')}
              className="flex flex-col items-center justify-center p-6 border-2 border-brand-light rounded-xl hover:border-brand-teal hover:bg-brand-light/30 transition-all text-center group"
            >
              <FileCheck size={40} className="text-brand-grey group-hover:text-brand-teal mb-4 transition-colors" />
              <span className="font-bold text-brand-dark">Calificación de Soldadores</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 className="text-2xl font-bold text-brand-dark mb-2 text-center">¿Qué servicio específico necesita?</h3>
          <p className="text-brand-grey text-center mb-8">Área seleccionada: <strong className="text-brand-teal">{area}</strong></p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getServicesForArea(area).map((opt) => (
              <button 
                key={opt}
                onClick={() => handleSelectService(opt)}
                className="text-left px-5 py-4 border-2 border-brand-light rounded-lg hover:border-brand-teal hover:bg-brand-light/30 transition-colors font-medium text-brand-dark"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 className="text-2xl font-bold text-brand-dark mb-2 text-center">Datos de Contacto</h3>
          <p className="text-brand-grey text-center mb-8">
            Complete sus datos para cotizar <strong className="text-brand-teal">{service}</strong>.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Nombre Completo *</label>
                <input required type="text" className="w-full border border-brand-grey/30 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-teal bg-brand-light" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Empresa</label>
                <input type="text" className="w-full border border-brand-grey/30 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-teal bg-brand-light" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Correo Electrónico *</label>
                <input required type="email" className="w-full border border-brand-grey/30 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-teal bg-brand-light" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Teléfono Móvil *</label>
                <input required type="tel" className="w-full border border-brand-grey/30 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-teal bg-brand-light" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Detalle del requerimiento *</label>
              <textarea required rows={4} className="w-full border border-brand-grey/30 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-teal bg-brand-light" placeholder="Indique cantidad de equipos, normas a certificar, o cualquier información relevante..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-brand-teal text-white font-bold py-4 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-70 text-lg flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-brand-teal/30"
            >
              {status === 'loading' ? 'Procesando...' : 'Enviar Solicitud'}
            </button>
            
            <p className="text-xs text-brand-grey text-center mt-4">
              Sus datos son confidenciales y serán utilizados exclusivamente para gestionar su cotización.
            </p>
          </form>
        </div>
      )}

    </div>
  );
}
