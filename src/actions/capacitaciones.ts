'use server'

import { prisma as db } from '@/lib/db';
import { Modality, SessionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createSessionSchema = z.object({
  courseSlug: z.string().min(1, 'Curso es requerido'),
  startDate: z.string().min(1, 'Fecha de inicio es requerida'),
  endDate: z.string().optional(),
  modality: z.nativeEnum(Modality),
  location: z.string().optional(),
  seatsTotal: z.coerce.number().min(1, 'Debe haber al menos 1 cupo'),
});

export async function createCourseSession(formData: FormData) {
  try {
    const data = createSessionSchema.parse({
      courseSlug: formData.get('courseSlug'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || undefined,
      modality: formData.get('modality'),
      location: formData.get('location') || undefined,
      seatsTotal: formData.get('seatsTotal'),
    });

    const session = await db.courseSession.create({
      data: {
        courseSlug: data.courseSlug,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        modality: data.modality,
        location: data.location,
        seatsTotal: data.seatsTotal,
        seatsTaken: 0,
        status: 'ABIERTA',
      },
    });

    revalidatePath('/admin-panel/capacitaciones');
    return { success: true, session };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Error al crear la sesión' };
  }
}

export async function closeCourseSession(id: string) {
  try {
    await db.courseSession.update({
      where: { id },
      data: { status: 'CERRADA' },
    });
    revalidatePath('/admin-panel/capacitaciones');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al cerrar la sesión' };
  }
}

export async function finishCourseSession(id: string) {
  try {
    await db.courseSession.update({
      where: { id },
      data: { status: 'FINALIZADA' },
    });
    revalidatePath('/admin-panel/capacitaciones');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al finalizar la sesión' };
  }
}
