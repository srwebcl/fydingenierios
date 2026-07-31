'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCourseOptions(type?: 'CATEGORY' | 'LEVEL' | 'MODALITY') {
  try {
    const options = await prisma.courseOption.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: 'asc' }
    });
    return { success: true, data: options };
  } catch (error) {
    console.error('Error fetching course options:', error);
    return { success: false, error: 'Failed to fetch options' };
  }
}

export async function createCourseOption(data: { type: string; name: string; abbreviation?: string }) {
  try {
    const newOption = await prisma.courseOption.create({
      data: {
        type: data.type,
        name: data.name,
        abbreviation: data.abbreviation || null,
      }
    });
    
    // Revalidamos las rutas donde se podrían estar mostrando estos datos
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/admin-panel/capacitaciones/crear');
    revalidatePath('/admin-panel/certificados');
    
    return { success: true, data: newOption };
  } catch (error: any) {
    console.error('Error creating course option:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe una opción con ese nombre para este tipo' };
    }
    return { success: false, error: 'Failed to create option' };
  }
}
