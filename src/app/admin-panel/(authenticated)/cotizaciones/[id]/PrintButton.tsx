'use client'

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export function PrintButton({ id }: { id: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Fetch the PDF from the API endpoint
      const response = await fetch(`/api/cotizaciones/${id}/pdf`);
      
      if (!response.ok) {
        throw new Error('No se pudo generar el PDF');
      }

      // Convert to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get filename from header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Cotizacion_${id}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el documento. Por favor, intente nuevamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-brand-dark text-white px-6 py-2 rounded-md font-bold hover:bg-brand-teal transition-colors flex items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <Loader2 size={18} className="mr-2 animate-spin" />
      ) : (
        <Download size={18} className="mr-2" />
      )}
      {isDownloading ? 'Generando PDF...' : 'Descargar PDF Oficial'}
    </button>
  );
}
