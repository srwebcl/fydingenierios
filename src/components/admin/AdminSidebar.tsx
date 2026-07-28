'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Award, Users, Settings, LogOut, FileText } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu = [
    { href: '/admin-panel', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin-panel/certificados', label: 'Credenciales', icon: Award },
    { href: '/admin-panel/capacitaciones', label: 'Capacitaciones', icon: Users },
    { href: '/admin-panel/leads', label: 'Bandeja Leads', icon: FileText },
    { href: '/admin-panel/perfil', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-brand-dark text-brand-light flex flex-col md:h-screen sticky bottom-0 md:top-0 z-50 order-2 md:order-1 border-t md:border-t-0 md:border-r border-brand-teal/20">
      <div className="hidden md:flex p-6 items-center justify-center border-b border-brand-light/10 bg-brand-white">
        <Image 
          src="/logo.jpeg" 
          alt="F&D Ingenieros" 
          width={120} 
          height={60} 
          className="h-10 w-auto object-contain"
        />
      </div>
      
      {/* Mobile nav: scrollable horizontal row. Desktop: vertical stack */}
      <nav className="flex-1 overflow-x-auto md:overflow-y-auto flex flex-row md:flex-col gap-1 p-2 md:p-4 no-scrollbar">
        {menu.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${isActive ? 'bg-brand-teal text-white font-bold' : 'hover:bg-brand-light/10 text-brand-light/80'}`}
            >
              <Icon size={20} />
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 border-t border-brand-light/10 mt-auto">
        <Link href="/admin-panel/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}
