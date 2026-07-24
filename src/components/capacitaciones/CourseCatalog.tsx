'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Course } from '@/content/courses';
import { Search, Clock, Award, FilterX } from 'lucide-react';

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');

  const categories = ['Todas', ...Array.from(new Set(courses.map(c => c.category)))];
  const levels = ['Todos', ...Array.from(new Set(courses.map(c => c.level)))];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchTerm, selectedCategory, selectedLevel]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar de Filtros */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-brand-light border border-brand-teal/20 p-6 rounded-xl">
          <h3 className="font-bold text-brand-dark mb-4 text-lg">Filtros</h3>
          
          <div className="mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar curso..." 
                className="w-full pl-10 pr-4 py-2 border border-brand-grey/30 rounded focus:border-brand-teal focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-brand-grey/60" size={18} />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-brand-dark mb-3">Categoría</h4>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="text-brand-teal focus:ring-brand-teal"
                  />
                  <span className="text-sm text-brand-grey">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-brand-dark mb-3">Nivel</h4>
            <div className="space-y-2">
              {levels.map(level => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="level" 
                    value={level}
                    checked={selectedLevel === level}
                    onChange={() => setSelectedLevel(level)}
                    className="text-brand-teal focus:ring-brand-teal"
                  />
                  <span className="text-sm text-brand-grey">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); setSelectedLevel('Todos'); }}
            className="w-full flex items-center justify-center gap-2 text-sm text-brand-teal hover:text-brand-dark font-medium transition"
          >
            <FilterX size={16} /> Limpiar filtros
          </button>
        </div>
      </div>

      {/* Grilla de Resultados */}
      <div className="lg:col-span-3">
        <div className="mb-6 text-brand-grey">
          Mostrando {filteredCourses.length} {filteredCourses.length === 1 ? 'curso' : 'cursos'}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-brand-light p-10 text-center rounded-xl border border-dashed border-brand-teal/40">
            <p className="text-brand-dark font-bold text-lg mb-2">No se encontraron cursos</p>
            <p className="text-brand-grey text-sm">Intente ajustando los filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map(course => (
              <div key={course.slug} className="bg-brand-white border border-brand-light rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full relative group">
                {course.includesDiploma && (
                  <div className="absolute top-4 right-4 bg-brand-lime text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Award size={12} /> Diploma QR
                  </div>
                )}
                
                <div className="p-6 flex-1 mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-brand-teal text-xs font-bold tracking-widest uppercase bg-brand-teal/10 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="text-brand-grey text-xs font-medium border border-brand-light px-2 py-1 rounded">
                      {course.level}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-teal transition">{course.title}</h2>
                  <p className="text-sm text-brand-grey mb-6 leading-relaxed">
                    {course.shortDescription}
                  </p>
                </div>
                
                <div className="px-6 py-4 bg-brand-light/50 border-t border-brand-light mt-auto flex items-center justify-between">
                  <div className="flex items-center text-xs text-brand-grey font-mono">
                    <Clock size={14} className="mr-1" /> {course.durationHours} hrs
                  </div>
                  <Link href={`/capacitaciones/${course.slug}`} className="text-brand-teal text-sm font-bold hover:text-brand-dark transition">
                    Ver Programa &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
