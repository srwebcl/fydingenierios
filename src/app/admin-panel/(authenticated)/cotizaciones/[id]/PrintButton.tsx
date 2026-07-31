'use client'

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-brand-dark text-white px-6 py-2 rounded-md font-bold hover:bg-brand-teal transition-colors flex items-center shadow-lg"
    >
      <Printer size={18} className="mr-2" />
      Imprimir / Guardar como PDF
    </button>
  );
}
