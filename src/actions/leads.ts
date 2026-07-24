'use server'

import { prisma as db } from '@/lib/db';
import { LeadStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(id: string, status: LeadStatus) {
  try {
    await db.lead.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin-panel/leads');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al actualizar estado del lead' };
  }
}
