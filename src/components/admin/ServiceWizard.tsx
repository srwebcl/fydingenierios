'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService, updateService, uploadServiceImage } from '@/actions/servicios';
import { PlusCircle, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Service } from '@prisma/client';

type Props = {
  initialData?: Service | null;
};

export function ServiceWizard({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    fullDescription: initialData?.fullDescription || '',
    imageUrl: initialData?.imageUrl || '',
  });

  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || ['']);
  const [deliverables, setDeliverables] = useState<string[]>(initialData?.deliverables || ['']);
  const [normatives, setNormatives] = useState<string[]>(initialData?.normatives || ['']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let finalValue = value;
      // Si están editando el slug manualmente, limpiamos las barras (/)
      if (name === 'slug') {
        finalValue = finalValue.replace(/\//g, '');
      }
      
      const updated = { ...prev, [name]: finalValue };
      // auto-generate slug from title if we are creating
      if (name === 'title' && !initialData) {
        updated.slug = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
          .replace(/^\/+|\/+$/g, '');
      }
      return updated;
    });
  };

  const handleArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const removeArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        const uploadRes = await uploadServiceImage(uploadFormData);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        } else {
          setError(uploadRes.error || 'Error al subir la imagen');
          setLoading(false);
          return;
        }
      }

      const dataToSave = {
        ...formData,
        imageUrl: finalImageUrl,
        benefits: benefits.filter(b => b.trim() !== ''),
        deliverables: deliverables.filter(d => d.trim() !== ''),
        normatives: normatives.filter(n => n.trim() !== ''),
      };

      let result;
      if (initialData) {
        result = await updateService(initialData.slug, dataToSave);
      } else {
        result = await createService(dataToSave);
      }

      if (result.success) {
        router.push('/admin-panel/servicios');
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const renderArraySection = (
    title: string,
    items: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string
  ) => (
    <div className="bg-brand-light p-6 rounded-xl border border-brand-light">
      <h3 className="font-bold text-brand-dark mb-4">{title}</h3>
      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(setter, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:border-brand-teal outline-none"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(setter, index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addArrayItem(setter)}
        className="flex items-center gap-2 text-brand-teal font-bold hover:text-brand-dark transition text-sm"
      >
        <PlusCircle size={16} /> Añadir Ítem
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 border border-brand-light/50">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-brand-dark mb-1">Título del Servicio *</label>
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej. Análisis de Vibraciones"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-brand-dark mb-1">URL Slug (Identificador) *</label>
          <input
            required
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="analisis-vibraciones"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-teal outline-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-brand-dark mb-1">Descripción Corta *</label>
        <textarea
          required
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          rows={2}
          placeholder="Resumen breve para la tarjeta de servicio..."
          className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-teal outline-none"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-brand-dark mb-1">Descripción Completa *</label>
        <textarea
          required
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          rows={5}
          placeholder="Descripción extensa del servicio que se mostrará en su página dedicada..."
          className="w-full px-4 py-2 border border-gray-300 rounded focus:border-brand-teal outline-none"
        />
      </div>

      <div className="mb-8 p-6 bg-brand-light/30 rounded-xl border border-brand-light">
        <label className="block text-sm font-bold text-brand-dark mb-1">Imagen Principal del Servicio</label>
        <p className="text-xs text-brand-grey mb-3">Se utilizará como fondo en las tarjetas de servicios. Medida recomendada: <strong>1200x800 píxeles</strong> (formato apaisado).</p>
        
        {formData.imageUrl && !imageFile && (
          <div className="mb-3 text-sm flex items-center gap-3">
            <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer" className="text-brand-teal font-bold hover:underline">
              Ver imagen actual
            </a>
            <span className="text-brand-grey text-xs">Sube una nueva para reemplazarla</span>
          </div>
        )}
        
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
          className="w-full border border-brand-grey/30 rounded px-3 py-2 bg-white" 
        />
        <p className="text-xs text-brand-grey mt-2">La imagen se subirá a Vercel Blob automáticamente al guardar.</p>
      </div>

      <div className="space-y-6 mb-8">
        {renderArraySection('Beneficios', benefits, setBenefits, 'Ej. Detección temprana de fallas')}
        {renderArraySection('Entregables', deliverables, setDeliverables, 'Ej. Informe técnico de diagnóstico')}
        {renderArraySection('Normativas (Opcional)', normatives, setNormatives, 'Ej. ISO 18436-2')}
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-brand-light">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-brand-grey text-brand-grey font-bold rounded hover:bg-brand-light transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-teal text-white px-8 py-2 font-bold rounded hover:bg-brand-dark transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : (initialData ? 'Actualizar Servicio' : 'Crear Servicio')}
          {!loading && <CheckCircle2 size={18} />}
        </button>
      </div>
    </form>
  );
}
