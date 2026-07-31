import React from 'react';

interface TrustBannerProps {
  text?: string;
}

export function TrustBanner({ text = "Especialistas en Confiabilidad de Activos y Mantenimiento Predictivo • Certificación Oficial de Informes Técnicos • Programas de Capacitación Técnica con Validación • " }: TrustBannerProps) {
  return (
    <div className="bg-brand-dark text-brand-lime py-1.5 overflow-hidden flex whitespace-nowrap font-mono text-xs font-bold tracking-widest uppercase relative border-b border-brand-teal/30">
      <div className="animate-marquee inline-flex">
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
      </div>
    </div>
  );
}
