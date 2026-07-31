import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-light pt-16 pb-8 border-t-4 border-brand-teal">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6 bg-white p-2 rounded-lg">
              <Image 
                src="/logo.jpeg" 
                alt="F&D Ingenieros" 
                width={120} 
                height={120} 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-brand-grey text-sm mb-6 leading-relaxed">
              Ingeniería en Mantenimiento Predictivo, Confiabilidad de Activos y Capacitación Industrial. Calidad técnica garantizada bajo los más altos estándares internacionales.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-brand-lime mb-4 text-sm tracking-widest uppercase">Servicios</h4>
            <ul className="space-y-3 text-sm text-brand-light/80">
              <li><Link href="/servicios/analisis-vibraciones" className="hover:text-brand-teal transition">Análisis de Vibraciones</Link></li>
              <li><Link href="/servicios/termografia-infrarroja" className="hover:text-brand-teal transition">Termografía Infrarroja</Link></li>
              <li><Link href="/servicios/alineamiento-laser" className="hover:text-brand-teal transition">Alineamiento Láser</Link></li>
              <li><Link href="/servicios/ingenieria-confiabilidad" className="hover:text-brand-teal transition">Ingeniería de Confiabilidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-lime mb-4 text-sm tracking-widest uppercase">Empresa</h4>
            <ul className="space-y-3 text-sm text-brand-light/80">
              <li><Link href="/quienes-somos" className="hover:text-brand-teal transition">Quiénes Somos</Link></li>
              <li><Link href="/capacitaciones" className="hover:text-brand-teal transition">Academia F&D</Link></li>
              <li><Link href="/certificados" className="hover:text-brand-teal transition">Validar Credencial</Link></li>
              <li><Link href="/contacto" className="hover:text-brand-teal transition">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-lime mb-4 text-sm tracking-widest uppercase">Contacto</h4>
            <ul className="space-y-3 text-sm text-brand-light/80">
              <li>📍 Rancagua, Región de O'Higgins, Chile.</li>
              <li>📧 contacto@fydingenieros.cl</li>
              <li>📞 +56 9 8389 4138</li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-brand-grey/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-grey">
          <p>&copy; {new Date().getFullYear()} Ingeniería en Mantenimiento F&D SpA. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terminos" className="hover:text-brand-teal">Términos y Condiciones</Link>
            <Link href="/privacidad" className="hover:text-brand-teal">Políticas de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
