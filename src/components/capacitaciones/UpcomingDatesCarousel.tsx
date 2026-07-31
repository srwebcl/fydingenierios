'use client';

import React, { useRef } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface Session {
  id: string;
  startDate: Date;
  modality: string;
  location: string | null;
  seatsTotal: number;
  seatsTaken: number;
}

interface Props {
  sessions: Session[];
}

export function UpcomingDatesCarousel({ sessions }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (sessions.length === 0) return null;

  return (
    <div className="relative group">
      {/* Scroll Controls - solo visibles si hay más de 1 */}
      {sessions.length > 1 && (
        <>
          <button 
            onClick={scrollLeft}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-brand-dark text-white rounded-full p-1 shadow-md transition hover:bg-brand-teal"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={scrollRight}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-brand-dark text-white rounded-full p-1 shadow-md transition hover:bg-brand-teal"
            aria-label="Siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory space-x-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sessions.map(s => {
          const cupos = s.seatsTotal - s.seatsTaken;
          const agotado = cupos <= 0;
          return (
            <div key={s.id} className="min-w-full shrink-0 snap-center bg-white/10 rounded-lg p-4 border border-brand-lime/20 relative overflow-hidden text-left">
              {agotado && <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Agotado</div>}
              {!agotado && cupos <= 3 && <div className="absolute top-0 right-0 bg-brand-lime text-brand-dark text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">Últimos {cupos}</div>}
              
              <p className="font-bold text-sm text-white mb-1">
                {new Date(s.startDate).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'long' })}
              </p>
              <div className="flex items-center text-xs text-brand-light/90">
                <MapPin size={12} className="mr-1 shrink-0" /> <span className="truncate">{s.modality.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
