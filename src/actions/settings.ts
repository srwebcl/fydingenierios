'use server'

import { prisma as db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  try {
    const data = {
      contactEmail: formData.get('contactEmail') as string,
      whatsappNumber: formData.get('whatsappNumber') as string,
      businessHoursOpen: formData.get('businessHoursOpen') as string,
      businessHoursClose: formData.get('businessHoursClose') as string,
    };

    const settings = await db.settings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    });

    revalidatePath('/'); // Invalidate everything since settings might be global
    revalidatePath('/admin-panel/perfil');
    return { success: true, settings };
  } catch (error) {
    return { success: false, error: 'Error al actualizar configuración' };
  }
}
