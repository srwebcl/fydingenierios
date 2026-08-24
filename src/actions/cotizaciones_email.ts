'use server'

import { prisma } from '@/lib/db';
import React from 'react';
import { sendQuotationEmail, sendQuotationSentNotificationEmail } from '@/lib/mail';
import fs from 'fs/promises';
import path from 'path';

// Helper to get logo buffer
async function getLogoBuffer(): Promise<Buffer | undefined> {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.webp');
    return await fs.readFile(logoPath);
  } catch (err) {
    console.warn('Logo no encontrado para PDF, usando solo texto.');
    return undefined;
  }
}

export async function emailQuotation(id: string) {
  try {
    const quote = await prisma.quotation.findUnique({ where: { id } });
    if (!quote) {
      return { success: false, error: 'Cotización no encontrada' };
    }

    // Generate PDF Buffer
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { QuotationPDF } = await import('@/components/pdf/QuotationPDF');

    const logoBuffer = await getLogoBuffer();
    let logoBase64 = undefined;
    if (logoBuffer) {
      logoBase64 = `data:image/webp;base64,${logoBuffer.toString('base64')}`;
    }

    const pdfElement = React.createElement(QuotationPDF, {
      data: quote,
      logoBase64
    });

    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // Send email to client
    const result = await sendQuotationEmail(
      quote.clientEmail,
      quote.clientName,
      quote.quoteNumber,
      quote.serviceName,
      pdfBuffer,
      logoBuffer
    );

    // If successful, send notification to sender
    if (result.success && quote.senderEmail) {
      await sendQuotationSentNotificationEmail(
        quote.senderEmail,
        quote.clientName,
        quote.clientEmail,
        quote.quoteNumber
      );
    }

    return result;
  } catch (error) {
    console.error('Error in emailQuotation action:', error);
    return { success: false, error: 'Fallo interno al enviar el correo' };
  }
}
