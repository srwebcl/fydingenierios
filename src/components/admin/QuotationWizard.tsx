'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Building2, User, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { createQuotation } from '@/actions/cotizaciones';

type ClientType = 'EMPRESA' | 'PERSONA';
type Item = { detail: string; unit: string; quantity: number; unitPrice: number; total: number };

export function QuotationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [clientType, setClientType] = useState<ClientType>('EMPRESA');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const [serviceName, setServiceName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [paymentTerms, setPaymentTerms] = useState('50% para aceptar oferta del servicio, 50% inicio del servicio');

  const [items, setItems] = useState<Item[]>([{ detail: '', unit: 'dias', quantity: 1, unitPrice: 0, total: 0 }]);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const iva = clientType === 'EMPRESA' ? subtotalAfterDiscount * 0.19 : 0;
  const total = subtotalAfterDiscount + iva;

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Auto calculate total for row
    if (field === 'quantity' || field === 'unitPrice') {
      item.total = Number(item.quantity) * Number(item.unitPrice);
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { detail: '', unit: 'dias', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const data = {
      clientType,
      clientName,
      clientPhone,
      clientCompany: clientType === 'EMPRESA' ? clientCompany : undefined,
      clientEmail,
      serviceName,
      requirements,
      validityDays: Number(validityDays),
      paymentTerms,
      items,
      discountPercent: Number(discountPercent),
      subtotal,
      iva,
      total
    };

    const res = await createQuotation(data);
    
    if (res.success && res.quotation) {
      router.push(`/admin-panel/cotizaciones/${res.quotation.id}`);
    } else {
      alert(res.error || 'Error al crear la cotización');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="flex mb-8 border-b border-brand-light pb-4">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`flex-1 text-center font-semibold text-sm ${step >= s ? 'text-brand-teal' : 'text-brand-grey/50'}`}
          >
            Paso {s}
          </div>
        ))}
      </div>

      {/* STEP 1: Client Data */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">1. Datos del Cliente</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setClientType('EMPRESA')}
              className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${clientType === 'EMPRESA' ? 'border-brand-teal bg-brand-teal/5 text-brand-teal' : 'border-brand-light text-brand-grey hover:border-brand-teal/50'}`}
            >
              <Building2 size={32} />
              <span className="font-bold">Empresa</span>
              <span className="text-xs text-brand-grey">+ 19% IVA, Datos Bancarios</span>
            </button>
            <button
              onClick={() => setClientType('PERSONA')}
              className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${clientType === 'PERSONA' ? 'border-brand-teal bg-brand-teal/5 text-brand-teal' : 'border-brand-light text-brand-grey hover:border-brand-teal/50'}`}
            >
              <User size={32} />
              <span className="font-bold">Persona Natural</span>
              <span className="text-xs text-brand-grey">0% IVA, Sin Banco</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">Nombre Completo (A:)</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" placeholder="Ej. Daniel Jofre Bocaz" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">Teléfono</label>
              <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" placeholder="Ej. 9-90768062" required />
            </div>
            {clientType === 'EMPRESA' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-1">Nombre Empresa</label>
                <input type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" placeholder="Ej. Electrical Solutions SPA" required={clientType === 'EMPRESA'} />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-brand-dark mb-1">Correo Electrónico</label>
              <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" placeholder="Ej. djofre@mseirl.cl" required />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: General Configuration */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">2. Detalles del Servicio</h2>
          
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">Servicio / Título de la Cotización</label>
            <input 
              type="text" 
              value={serviceName} 
              onChange={e => {
                setServiceName(e.target.value);
                // Si el item 1 está vacío, llenarlo automáticamente
                if (items.length > 0 && items[0].detail === '') {
                  const newItems = [...items];
                  newItems[0].detail = e.target.value;
                  setItems(newItems);
                }
              }} 
              className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" 
              placeholder="Ej. TERMOGRAFÍA INFRARROJA NIVEL I (Para 2 personas)" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1">Requerimiento (Descripción)</label>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={3} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition resize-none" placeholder="Ej. Curso para 2 personas. Enfocado en el área Eléctrica..." required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">Vigencia de la Oferta (Días)</label>
              <input type="number" value={validityDays} onChange={e => setValidityDays(Number(e.target.value))} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">Modalidad de Pago</label>
              <input type="text" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="w-full border border-brand-light rounded-lg px-4 py-2 focus:outline-none focus:border-brand-teal transition" required />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Economic Offer */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">3. Oferta Económica</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-brand-light text-brand-dark text-sm border-b-2 border-brand-dark">
                  <th className="p-2 text-left w-12">N°</th>
                  <th className="p-2 text-left">Detalle</th>
                  <th className="p-2 text-left w-24">Unidad</th>
                  <th className="p-2 text-left w-24">Cantidad</th>
                  <th className="p-2 text-left w-32">Valor Unitario</th>
                  <th className="p-2 text-right w-32">Total Unitario</th>
                  <th className="p-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-brand-light">
                    <td className="p-2 font-bold">{i + 1}</td>
                    <td className="p-2">
                      <input type="text" value={item.detail} onChange={e => handleItemChange(i, 'detail', e.target.value)} className="w-full border border-brand-light rounded px-2 py-1 text-sm focus:outline-none focus:border-brand-teal" placeholder="Ej. Curso Termografía..." />
                    </td>
                    <td className="p-2">
                      <input type="text" value={item.unit} onChange={e => handleItemChange(i, 'unit', e.target.value)} className="w-full border border-brand-light rounded px-2 py-1 text-sm focus:outline-none focus:border-brand-teal" placeholder="Ej. días" />
                    </td>
                    <td className="p-2">
                      <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', Number(e.target.value))} className="w-full border border-brand-light rounded px-2 py-1 text-sm focus:outline-none focus:border-brand-teal" />
                    </td>
                    <td className="p-2">
                      <input type="number" min="0" value={item.unitPrice} onChange={e => handleItemChange(i, 'unitPrice', Number(e.target.value))} className="w-full border border-brand-light rounded px-2 py-1 text-sm focus:outline-none focus:border-brand-teal" />
                    </td>
                    <td className="p-2 text-right font-semibold text-brand-dark">
                      ${item.total.toLocaleString('es-CL')}
                    </td>
                    <td className="p-2 text-center">
                      <button onClick={() => removeItem(i)} disabled={items.length === 1} className="text-brand-grey hover:text-red-500 disabled:opacity-30"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button onClick={addItem} className="flex items-center text-sm font-semibold text-brand-teal hover:text-brand-dark transition-colors">
            <Plus size={16} className="mr-1"/> Agregar Ítem
          </button>

          <div className="flex justify-end mt-8">
            <div className="w-64 border-t-2 border-brand-dark pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-brand-dark">Subtotal</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between mb-2 items-center">
                <span className="font-semibold text-brand-dark flex items-center gap-2">
                  Descuento
                  <div className="flex items-center bg-gray-100 rounded px-2">
                    <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} className="w-12 bg-transparent text-right py-1 focus:outline-none text-sm" />
                    <span className="text-sm font-bold text-gray-500">%</span>
                  </div>
                </span>
                <span className="text-red-500">-${discountAmount.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-brand-dark">IVA {clientType === 'PERSONA' ? '(0%)' : ''}</span>
                <span>${iva.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-brand-teal pt-2 border-t border-brand-light">
                <span>Total</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-12 flex justify-between pt-6 border-t border-brand-light">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1 || isSubmitting}
          className="flex items-center px-4 py-2 text-brand-grey font-medium hover:text-brand-dark transition-colors disabled:opacity-0"
        >
          <ArrowLeft size={20} className="mr-2" /> Anterior
        </button>
        
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={(step === 1 && !clientName) || (step === 2 && !serviceName)}
            className="flex items-center px-6 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            Siguiente <ArrowRight size={20} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || items.some(i => !i.detail)}
            className="flex items-center px-6 py-2 bg-brand-teal text-white rounded-lg font-bold hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Generando...' : 'Generar Cotización PDF'}
            {!isSubmitting && <CheckCircle2 size={20} className="ml-2" />}
          </button>
        )}
      </div>
    </div>
  );
}
