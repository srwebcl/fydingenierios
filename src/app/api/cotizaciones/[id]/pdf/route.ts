import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { prisma } from '@/lib/db';
import { QuotationPDF } from '@/components/pdf/QuotationPDF';
import React from 'react';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const quote = await prisma.quotation.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }

    // Prepare Logo (as base64 to avoid URL loading issues inside PDF generator)
    let logoBase64 = undefined;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.jpeg');
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        logoBase64 = `data:image/jpeg;base64,${logoData.toString('base64')}`;
      }
    } catch (e) {
      console.warn("Could not load logo for PDF generation");
    }

    // Render the PDF to a stream
    const stream = await renderToStream(
      React.createElement(QuotationPDF, { data: quote, logoBase64 }) as any
    );

    // Convert the stream to a readable stream for Next.js response
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      }
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Cotizacion_${quote.quoteNumber}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error interno al generar el PDF' }, { status: 500 });
  }
}
