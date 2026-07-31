'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@prisma/client';
import { Clock, Award } from 'lucide-react';

export function CourseCatalog({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-brand-grey bg-white rounded-xl shadow border border-brand-light">
        Aún no hay cursos publicados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course.id} className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow duration-300 border border-brand-light/50 flex flex-col group relative">
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
            
            <h3 className="text-xl font-bold font-heading text-brand-dark mb-3 group-hover:text-brand-teal transition-colors">
              {course.title}
            </h3>
            
            <p className="text-sm text-brand-grey mb-6 line-clamp-3 leading-relaxed">
              {course.shortDescription}
            </p>
            
            <div className="space-y-2 mt-auto">
              <div className="flex items-center text-sm text-brand-grey font-mono">
                <Clock size={16} className="mr-2 text-brand-lime" />
                <span>{course.durationHours} hrs</span>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-brand-light bg-gray-50 rounded-b-xl flex justify-between items-center">
            <span className="text-sm font-bold text-brand-dark">Saber más</span>
            <Link 
              href={`/capacitaciones/${course.slug}`}
              className="px-4 py-2 bg-brand-dark text-white text-sm font-bold rounded hover:bg-brand-teal transition"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
