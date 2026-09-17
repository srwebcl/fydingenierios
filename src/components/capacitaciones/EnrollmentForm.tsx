'use client';

import React, { useState } from 'react';
import { createEnrollment } from '@/actions/enrollments';

interface Props {
  courseSessionId: string;
}

export function EnrollmentForm({ courseSessionId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'waitlist'>('idle');
  const [error, setError] = useState('');
  const [showBilling, setShowBilling] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (honeypot) {
      setStatus('loading');
      setTimeout(() => setStatus('success'), 1000);
      return;
    }

    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const res = await createEnrollment(courseSessionId, formData);

    if (res.success) {
      setStatus(res.status === 'LISTA_ESPERA' ? 'waitlist' : 'success');
    } else {
      setStatus('idle');
      setError(res.error || 'Error al enviar la inscripción.');
    }
  };

  if (status === 'success' || status === 'waitlist') {
    return (
      <div className="bg-brand-light border border-brand-teal p-8 rounded-xl text-center">
        <div className="w-14 h-14 bg-brand-lime/20 text-brand-lime rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        {status === 'success' ? (
          <>
            <h3 className="font-bold text-xl text-brand-dark mb-2">¡Inscripción recibida!</h3>
            <p className="text-brand-grey">Hemos registrado tu cupo. Nuestro equipo se pondrá en contacto para confirmar los detalles y medios de pago.</p>
          </>
        ) : (
          <>
            <h3 className="font-bold text-xl text-brand-dark mb-2">Quedaste en lista de espera</h3>
            <p className="text-brand-grey">Los cupos de esta sesión están completos. Registramos tus datos y te avisaremos si se libera un cupo o se agenda una nueva fecha.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-brand-grey/20 shadow-xl p-6 md:p-8 rounded-xl space-y-8">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      {/* Honeypot */}
      <div aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
        <label htmlFor="enroll-website">Website</label>
        <input type="text" id="enroll-website" name="enroll-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <section>
        <h3 className="font-bold text-lg text-brand-dark mb-4 border-b border-brand-light pb-2">1. Datos del participante</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-brand-dark mb-1">Nombre completo *</label>
            <input required type="text" name="fullName" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">RUT *</label>
            <input required type="text" name="rut" placeholder="Ej: 12.345.678-9" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Cargo</label>
            <input type="text" name="position" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Empresa</label>
            <input type="text" name="company" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Área / Departamento</label>
            <input type="text" name="department" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Teléfono *</label>
            <input required type="tel" name="phone" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Correo electrónico *</label>
            <input required type="email" name="email" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-lg text-brand-dark mb-4 border-b border-brand-light pb-2">2. Antecedentes técnicos y de experiencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-brand-dark mb-1">Formación profesional / técnica</label>
            <input type="text" name="education" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Experiencia en mantenimiento</label>
            <select name="maintenanceExperience" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
              <option value="">Selecciona...</option>
              <option value="SIN_EXPERIENCIA">Sin experiencia</option>
              <option value="ANIOS_1_3">1–3 años</option>
              <option value="ANIOS_3_5">3–5 años</option>
              <option value="MAS_5">+5 años</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Experiencia en la técnica del curso</label>
            <select name="techExperience" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm">
              <option value="">Selecciona...</option>
              <option value="SIN_EXPERIENCIA">Sin experiencia</option>
              <option value="BASICA">Básica</option>
              <option value="INTERMEDIA">Intermedia</option>
              <option value="AVANZADA">Avanzada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Certificaciones relacionadas</label>
            <input type="text" name="relatedCertifications" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Cursos previos relacionados</label>
            <input type="text" name="previousCourses" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-lg text-brand-dark mb-4 border-b border-brand-light pb-2">3. Requerimientos especiales</h3>
        <textarea name="specialRequirements" rows={3} placeholder="Indique si requiere alguna consideración para el desarrollo de la capacitación" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm"></textarea>
      </section>

      <section>
        <button type="button" onClick={() => setShowBilling(!showBilling)} className="font-bold text-lg text-brand-dark mb-2 border-b border-brand-light pb-2 w-full text-left flex items-center justify-between">
          4. Datos de facturación / contacto empresa (opcional)
          <span className="text-brand-teal text-sm">{showBilling ? 'Ocultar' : 'Mostrar'}</span>
        </button>
        {showBilling && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Razón social</label>
              <input type="text" name="businessName" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">RUT empresa</label>
              <input type="text" name="businessRut" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Contacto de coordinación</label>
              <input type="text" name="coordinationContact" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Correo de facturación</label>
              <input type="email" name="billingEmail" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-brand-dark mb-1">Orden de compra / referencia</label>
              <input type="text" name="purchaseOrder" className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
            </div>
          </div>
        )}
      </section>

      <div className="flex items-start gap-2">
        <input required type="checkbox" id="declaration" className="mt-1" />
        <label htmlFor="declaration" className="text-xs text-brand-grey">
          Declaro que los antecedentes proporcionados son correctos y autorizo a F&D Ingeniería en Mantenimiento SpA a utilizarlos para fines de inscripción, gestión, ejecución, evaluación y registro de esta capacitación.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-brand-teal text-white font-bold py-3 rounded hover:bg-brand-dark transition-colors disabled:opacity-70"
      >
        {status === 'loading' ? 'Enviando...' : 'Confirmar Inscripción'}
      </button>
    </form>
  );
}
