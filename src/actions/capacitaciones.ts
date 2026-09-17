'use server'

import { prisma as db } from '@/lib/db';
import { Modality, SessionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { put } from '@vercel/blob';

export async function uploadCoursePdf(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No se envió ningún archivo' };

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('Falta el token BLOB_READ_WRITE_TOKEN');
      return { success: false, error: 'Configuración del CDN incompleta' };
    }

    const blob = await put(`programas/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error('Error completo al subir PDF a Vercel Blob:', error);
    return { success: false, error: `Error CDN: ${error.message}` };
  }
}

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
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${session.courseSlug}`);
    return { success: true, session };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: (error as any).errors[0].message };
    }
    return { success: false, error: 'Error al crear la sesión' };
  }
}

export async function closeCourseSession(id: string) {
  try {
    const session = await db.courseSession.update({
      where: { id },
      data: { status: 'CERRADA' },
    });
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${session.courseSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al cerrar la sesión' };
  }
}

export async function finishCourseSession(id: string) {
  try {
    const session = await db.courseSession.update({
      where: { id },
      data: { status: 'FINALIZADA' },
    });
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${session.courseSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al finalizar la sesión' };
  }
}

export async function deleteCourseSession(id: string) {
  try {
    const session = await db.courseSession.delete({ where: { id } });
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${session.courseSlug}`);
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { success: false, error: 'No se puede eliminar: esta sesión tiene inscritos o diplomas vinculados.' };
    }
    return { success: false, error: 'Error al eliminar la sesión' };
  }
}

export async function createCourse(data: any) {
  try {
    const course = await db.course.create({
      data: {
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        durationHours: parseInt(data.durationHours, 10),
        includesDiploma: data.includesDiploma,
        category: data.category,
        level: data.level,
        modality: data.modality || null,
        evaluation: data.evaluation || null,
        material: data.material || null,
        certificationText: data.certificationText || null,
        audience: data.audience || null,
        whatYouWillLearn: data.whatYouWillLearn || [],
        whyChooseUs: data.whyChooseUs || [],
        instructorName: data.instructorName || null,
        instructorTitle: data.instructorTitle || null,
        instructorDesc: data.instructorDesc || null,
        syllabus: data.syllabus || [],
        faqs: data.faqs || [],
        pdfUrl: data.pdfUrl || null,
      }
    });
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${course.slug}`);
    return { success: true, course };
  } catch (error) {
    console.error('Error creating course:', error);
    return { success: false, error: 'Error al crear el curso' };
  }
}

export async function updateCourse(id: string, data: any) {
  try {
    const existing = await db.course.findUnique({ where: { id }, select: { slug: true } });

    const course = await db.course.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        durationHours: parseInt(data.durationHours, 10),
        includesDiploma: data.includesDiploma,
        category: data.category,
        level: data.level,
        modality: data.modality || null,
        evaluation: data.evaluation || null,
        material: data.material || null,
        certificationText: data.certificationText || null,
        audience: data.audience || null,
        whatYouWillLearn: data.whatYouWillLearn || [],
        whyChooseUs: data.whyChooseUs || [],
        instructorName: data.instructorName || null,
        instructorTitle: data.instructorTitle || null,
        instructorDesc: data.instructorDesc || null,
        syllabus: data.syllabus || [],
        faqs: data.faqs || [],
        pdfUrl: data.pdfUrl || null,
      }
    });
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${course.slug}`);
    if (existing && existing.slug !== course.slug) {
      revalidatePath(`/capacitaciones/${existing.slug}`);
    }
    return { success: true, course };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: 'Error al actualizar el curso' };
  }
}

export async function deleteCourse(id: string) {
  try {
    const course = await db.course.findUnique({ where: { id }, select: { slug: true } });
    if (!course) {
      return { success: false, error: 'Curso no encontrado' };
    }

    const sessionsCount = await db.courseSession.count({ where: { courseSlug: course.slug } });
    if (sessionsCount > 0) {
      return { success: false, error: 'No se puede eliminar: este curso tiene sesiones programadas. Elimínalas primero.' };
    }

    await db.course.delete({ where: { id } });

    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath('/capacitaciones');
    revalidatePath(`/capacitaciones/${course.slug}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Error al eliminar el curso' };
  }
}
