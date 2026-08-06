'use client';

import React from 'react';
import { FileText } from 'lucide-react';

export function PrintButton() {
  return (
    <div className="fixed bottom-6 right-6 print:hidden">
      <button 
        onClick={() => window.print()} 
        className="bg-brand-teal text-white p-4 rounded-full shadow-lg hover:bg-brand-dark transition-colors flex items-center justify-center group"
        title="Imprimir / Guardar PDF"
      >
        <FileText size={24} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out">
          Guardar PDF
        </span>
      </button>
    </div>
  );
}
