'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createQuotation(data: {
  clientType: string;
  clientName: string;
  clientPhone: string;
  clientCompany?: string;
  clientEmail: string;
  serviceName: string;
  requirements: string;
  validityDays: number;
  paymentTerms: string;
  items: any[];
  discountPercent?: number;
  subtotal: number;
  iva: number;
  total: number;
}) {
  try {
    const lastQuote = await prisma.quotation.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    let nextNumStr = '0001';
    if (lastQuote && lastQuote.quoteNumber) {
      const parts = lastQuote.quoteNumber.split('-');
      const lastNum = parts[parts.length - 1];
      if (lastNum && !isNaN(parseInt(lastNum, 10))) {
        nextNumStr = (parseInt(lastNum, 10) + 1).toString().padStart(4, '0');
      }
    }
    const quoteNumber = `COT-FD-${nextNumStr}`;

    const quotation = await prisma.quotation.create({
      data: {
        ...data,
        quoteNumber,
      }
    });

    revalidatePath('/admin-panel/cotizaciones');
    return { success: true, quotation };
  } catch (error: any) {
    console.error('Error creating quotation:', error);
    return { success: false, error: error.message || 'Error al crear la cotización' };
  }
}

export async function deleteQuotation(id: string) {
  try {
    await prisma.quotation.delete({
      where: { id }
    });
    
    revalidatePath('/admin-panel/cotizaciones');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting quotation:', error);
    return { success: false, error: error.message || 'Error al eliminar la cotización' };
  }
}
