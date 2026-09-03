'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse, updateCourse, uploadCoursePdf } from '@/actions/capacitaciones';

interface CourseWizardProps {
  initialData?: any;
  isEditing?: boolean;
  options?: any[];
}

export default function CourseWizard({ initialData, isEditing = false, options = [] }: CourseWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newOptionModal, setNewOptionModal] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: '' });
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionAbbr, setNewOptionAbbr] = useState('');
  const [creatingOption, setCreatingOption] = useState(false);
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOption(true);
    try {
      const { createCourseOption } = await import('@/actions/courseOptions');
      const res = await createCourseOption({
        type: newOptionModal.type,
        name: newOptionName,
        abbreviation: newOptionModal.type === 'CATEGORY' ? newOptionAbbr : undefined
      });
      if (!res.success) {
        alert(res.error);
      } else {
        setFormData(prev => ({
          ...prev,
          [newOptionModal.type === 'CATEGORY' ? 'category' : newOptionModal.type === 'LEVEL' ? 'level' : 'modality']: newOptionName
        }));
        router.refresh(); 
        setNewOptionModal({ isOpen: false, type: '' });
        setNewOptionName('');
        setNewOptionAbbr('');
      }
    } catch (err) {
      alert('Error al crear opción');
    }
    setCreatingOption(false);
  };

  const categories = options.filter(o => o.type === 'CATEGORY');
  const levels = options.filter(o => o.type === 'LEVEL');
  const modalities = options.filter(o => o.type === 'MODALITY');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Confiabilidad',
    level: initialData?.level || 'Introductorio',
    durationHours: initialData?.durationHours || 16,
    includesDiploma: initialData?.includesDiploma ?? true,
    modality: initialData?.modality || 'Presencial / Online en vivo',
    pdfUrl: initialData?.pdfUrl || '',
    shortDescription: initialData?.shortDescription || '',
    fullDescription: initialData?.fullDescription || '',
    audience: initialData?.audience || '',
    instructorName: initialData?.instructorName || '',
    instructorTitle: initialData?.instructorTitle || '',
    instructorDesc: initialData?.instructorDesc || '',
    certificationText: initialData?.certificationText || '',
  });

  const [syllabus, setSyllabus] = useState<{ title: string, topics: string[] }[]>(
    initialData?.syllabus?.length > 0 ? initialData.syllabus : [{ title: 'Módulo 1', topics: ['Tema 1'] }]
  );
  
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>(
    initialData?.whatYouWillLearn?.length > 0 ? initialData.whatYouWillLearn : ['']
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Si están editando el slug manualmente, limpiamos las barras (/)
    if (name === 'slug' && typeof finalValue === 'string') {
      finalValue = finalValue.replace(/\//g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const generateSlug = () => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: formData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
          .replace(/^\/+|\/+$/g, '')
      }));
    }
  };

  const handleSyllabusChange = (index: number, field: 'title' | 'topics', value: string) => {
    const newSyllabus = [...syllabus];
    if (field === 'title') {
      newSyllabus[index].title = value;
    } else {
      newSyllabus[index].topics = value.split('\n').filter(t => t.trim() !== '');
    }
    setSyllabus(newSyllabus);
  };

  const addModule = () => setSyllabus([...syllabus, { title: `Módulo ${syllabus.length + 1}`, topics: [] }]);
  const removeModule = (index: number) => setSyllabus(syllabus.filter((_, i) => i !== index));

  const handleLearnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWhatYouWillLearn(e.target.value.split('\n').filter(t => t.trim() !== ''));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    let finalPdfUrl = formData.pdfUrl;

    if (pdfFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', pdfFile);
      const uploadRes = await uploadCoursePdf(uploadFormData);
      if (uploadRes.success && uploadRes.url) {
        finalPdfUrl = uploadRes.url;
      } else {
        setError(uploadRes.error || 'Error al subir el archivo PDF');
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...formData,
      pdfUrl: finalPdfUrl,
      syllabus,
      whatYouWillLearn
    };

    let res;
    if (isEditing) {
      res = await updateCourse(initialData.id, payload);
    } else {
      res = await createCourse(payload);
    }

    if (res.success) {
      alert(isEditing ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente');
      router.push('/admin-panel/capacitaciones');
      router.refresh();
    } else {
      setError(res.error || 'Error al guardar');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 relative">
      {newOptionModal.isOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold font-heading mb-4 text-brand-dark">
              Crear Nueva {newOptionModal.type === 'CATEGORY' ? 'Categoría' : newOptionModal.type === 'LEVEL' ? 'Nivel' : 'Modalidad'}
            </h3>
            <form onSubmit={handleCreateOption} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Nombre</label>
                <input type="text" value={newOptionName} onChange={e => setNewOptionName(e.target.value)} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: Análisis de Aceite" />
              </div>
              {newOptionModal.type === 'CATEGORY' && (
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Abreviación (Para N° Certificado)</label>
                  <input type="text" value={newOptionAbbr} onChange={e => setNewOptionAbbr(e.target.value)} required className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" placeholder="Ej: OA" />
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setNewOptionModal({ isOpen: false, type: '' })} className="px-4 py-2 text-sm text-brand-grey font-bold hover:bg-gray-100 rounded">Cancelar</button>
                <button type="submit" disabled={creatingOption} className="px-4 py-2 text-sm bg-brand-teal text-white font-bold rounded hover:bg-brand-teal/80 disabled:opacity-50">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex mb-8 border-b border-brand-light pb-4 overflow-x-auto">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex items-center mr-8 ${step >= s ? 'text-brand-teal' : 'text-brand-grey/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2 ${step >= s ? 'bg-brand-teal text-white' : 'bg-brand-light text-brand-grey'}`}>
              {s}
            </div>
            <span className="font-bold text-sm whitespace-nowrap">
              {s === 1 ? 'Datos Generales' : s === 2 ? 'Descripción' : 'Temario'}
            </span>
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      <div className="space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-bold text-brand-dark mb-1">Título del Curso</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} onBlur={generateSlug} required className="w-full border border-brand-grey/30 rounded px-3 py-2" placeholder="Ej: Análisis de Vibraciones Nivel I" />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-bold text-brand-dark mb-1">Identificador URL (Slug)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full border border-brand-grey/30 rounded px-3 py-2 bg-brand-light/20 font-mono text-sm" placeholder="analisis-vibraciones-nivel-i" />
              <p className="text-xs text-brand-grey mt-1">Debe ser único. Letras minúsculas y guiones.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Categoría</label>
              <div className="flex gap-2">
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full border border-brand-grey/30 rounded px-3 py-2">
                  <option value="">Selecciona...</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <button type="button" onClick={() => setNewOptionModal({ isOpen: true, type: 'CATEGORY' })} className="px-3 bg-brand-light text-brand-dark font-bold text-xs rounded hover:bg-gray-200 shrink-0">+ Nueva</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Nivel</label>
              <div className="flex gap-2">
                <select name="level" value={formData.level} onChange={handleChange} required className="w-full border border-brand-grey/30 rounded px-3 py-2">
                  <option value="">Selecciona...</option>
                  {levels.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
                <button type="button" onClick={() => setNewOptionModal({ isOpen: true, type: 'LEVEL' })} className="px-3 bg-brand-light text-brand-dark font-bold text-xs rounded hover:bg-gray-200 shrink-0">+ Nuevo</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Duración (Horas)</label>
              <input type="number" name="durationHours" value={formData.durationHours} onChange={handleChange} min="1" className="w-full border border-brand-grey/30 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Modalidad Predeterminada</label>
              <div className="flex gap-2">
                <select name="modality" value={formData.modality} onChange={handleChange} required className="w-full border border-brand-grey/30 rounded px-3 py-2">
                  <option value="">Selecciona...</option>
                  {modalities.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
                <button type="button" onClick={() => setNewOptionModal({ isOpen: true, type: 'MODALITY' })} className="px-3 bg-brand-light text-brand-dark font-bold text-xs rounded hover:bg-gray-200 shrink-0">+ Nueva</button>
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-bold text-brand-dark mb-1">Archivo del Programa (PDF)</label>
              {formData.pdfUrl && !pdfFile && (
                <div className="mb-2 text-sm">
                  <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-brand-teal font-bold hover:underline">
                    Ver PDF actual
                  </a>
                  <span className="text-brand-grey mx-2">|</span>
                  <span className="text-brand-grey">Sube un nuevo archivo para reemplazarlo:</span>
                </div>
              )}
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)} 
                className="w-full border border-brand-grey/30 rounded px-3 py-2 bg-white" 
              />
              <p className="text-xs text-brand-grey mt-1">El archivo se subirá a Vercel Blob y se vinculará automáticamente al curso.</p>
            </div>

            <div className="col-span-full flex items-center gap-2">
              <input type="checkbox" name="includesDiploma" checked={formData.includesDiploma} onChange={handleChange} id="diploma" className="w-5 h-5" />
              <label htmlFor="diploma" className="text-sm font-bold text-brand-dark">Incluye Emisión de Diploma Oficial F&D</label>
            </div>

            {formData.includesDiploma && (
              <div className="col-span-full bg-brand-light/10 p-4 rounded border border-brand-light">
                <label className="block text-sm font-bold text-brand-dark mb-1">Párrafo de Certificación (Para Diploma / Validación)</label>
                <p className="text-xs text-brand-grey mb-2">Pega aquí el texto completo que irá en el diploma. Usa los comodines <strong>{"{{fechas}}"}</strong> y <strong>{"{{horas}}"}</strong> para que el sistema los complete automáticamente al emitir un certificado.</p>
                <textarea 
                  name="certificationText" 
                  value={formData.certificationText} 
                  onChange={handleChange} 
                  rows={4}
                  className="w-full border border-brand-grey/30 rounded px-3 py-2 bg-white" 
                  placeholder="Ej: Este certificado acredita la participación y finalización de la capacitación. El curso se realizó durante los días {{fechas}}, con una duración total de {{horas}} horas..." 
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Descripción Corta (Para tarjetas)</label>
              <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} required className="w-full border border-brand-grey/30 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Descripción Completa</label>
              <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={5} required className="w-full border border-brand-grey/30 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">Dirigido a (Público Objetivo)</label>
              <textarea name="audience" value={formData.audience} onChange={handleChange} rows={3} className="w-full border border-brand-grey/30 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-1">¿Qué aprenderán? (Una línea por ítem)</label>
              <textarea 
                defaultValue={whatYouWillLearn.join('\n')} 
                onChange={handleLearnChange}
                rows={5} 
                className="w-full border border-brand-grey/30 rounded px-3 py-2" 
                placeholder="Fundamentos del análisis...&#10;Interpretación de espectros..." 
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-brand-dark border-b border-brand-light pb-2">Temario (Módulos)</h3>
            
            {syllabus.map((mod, index) => (
              <div key={index} className="bg-brand-light/30 p-4 rounded-lg border border-brand-light relative">
                <button type="button" onClick={() => removeModule(index)} className="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline">Eliminar</button>
                <div className="mb-3">
                  <label className="block text-xs font-bold text-brand-dark mb-1">Título del Módulo</label>
                  <input type="text" value={mod.title} onChange={e => handleSyllabusChange(index, 'title', e.target.value)} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">Temas (Uno por línea)</label>
                  <textarea value={mod.topics.join('\n')} onChange={e => handleSyllabusChange(index, 'topics', e.target.value)} rows={4} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
                </div>
              </div>
            ))}

            <button type="button" onClick={addModule} className="w-full py-2 border-2 border-dashed border-brand-teal text-brand-teal font-bold rounded-lg hover:bg-brand-teal/5 transition">
              + Agregar Módulo
            </button>

            <h3 className="font-bold text-lg text-brand-dark border-b border-brand-light pb-2 mt-8">Instructor (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Nombre</label>
                <input type="text" name="instructorName" value={formData.instructorName} onChange={handleChange} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Título / Cargo</label>
                <input type="text" name="instructorTitle" value={formData.instructorTitle} onChange={handleChange} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>
              <div className="col-span-full">
                <label className="block text-xs font-bold text-brand-dark mb-1">Biografía Corta</label>
                <textarea name="instructorDesc" value={formData.instructorDesc} onChange={handleChange} rows={2} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-brand-light flex justify-between">
        <button 
          type="button"
          onClick={() => setStep(step - 1)} 
          disabled={step === 1}
          className="px-6 py-2 bg-brand-light text-brand-dark font-bold rounded hover:bg-gray-200 transition disabled:opacity-50"
        >
          Anterior
        </button>
        
        {step < 3 ? (
          <button 
            type="button"
            onClick={() => setStep(step + 1)}
            className="px-6 py-2 bg-brand-teal text-white font-bold rounded hover:bg-brand-teal/80 transition"
          >
            Siguiente
          </button>
        ) : (
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-brand-dark text-white font-bold rounded shadow-lg hover:bg-brand-dark/80 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Curso')}
          </button>
        )}
      </div>
    </div>
  );
}
