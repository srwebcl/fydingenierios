'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton({ phoneNumber }: { phoneNumber?: string }) {
  const pathname = usePathname();
  
  // Phone number from prop, environment, or fallback
  const phone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+56983894138';
  
  // Contextual message
  let message = 'Hola, quisiera hacer una consulta comercial.';
  if (pathname.startsWith('/servicios/')) {
    const slug = pathname.split('/').pop()?.replace(/-/g, ' ');
    message = `Hola, vengo de la página web y quiero cotizar el servicio de ${slug}.`;
  } else if (pathname.startsWith('/capacitaciones/')) {
    const slug = pathname.split('/').pop()?.replace(/-/g, ' ');
    message = `Hola, estoy interesado en inscribirme al curso de ${slug}.`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 group flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-brand-dark text-white text-sm font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Cotizar rápido
      </span>
    </a>
  );
}
