'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/quienes-somos', label: 'Quiénes Somos' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/capacitaciones', label: 'Academia F&D' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-white border-b border-brand-light shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.jpeg" 
                alt="Logo F&D" 
                width={240} 
                height={80} 
                className="h-[76px] w-auto object-contain group-hover:scale-105 transition-transform py-1"
                priority
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-brand-dark hover:text-brand-teal font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/certificados"
              className="bg-brand-teal text-brand-white px-6 py-2.5 rounded font-bold hover:bg-brand-dark transition-colors shadow-md"
            >
              Validaciones
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-white border-t border-brand-light shadow-inner">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className="block px-3 py-3 text-brand-dark hover:bg-brand-light rounded font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/certificados"
              className="block px-3 py-3 mt-4 text-center bg-brand-teal text-brand-white rounded font-bold shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Validaciones
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
