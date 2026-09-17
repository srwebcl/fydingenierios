'use server'

import { prisma as db } from '@/lib/db';
import { EnrollmentStatus, MaintenanceExperience, TechExperience } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SEAT_OCCUPYING: EnrollmentStatus[] = ['INSCRITO', 'CONFIRMADO'];

const enrollmentSchema = z.object({
  fullName: z.string().min(1, 'Nombre completo es requerido'),
  rut: z.string().min(1, 'RUT es requerido'),
  position: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().min(1, 'Teléfono es requerido'),
  email: z.string().email('Correo inválido'),
  education: z.string().optional(),
  maintenanceExperience: z.nativeEnum(MaintenanceExperience).optional(),
  techExperience: z.nativeEnum(TechExperience).optional(),
  relatedCertifications: z.string().optional(),
  previousCourses: z.string().optional(),
  specialRequirements: z.string().optional(),
  businessName: z.string().optional(),
  businessRut: z.string().optional(),
  coordinationContact: z.string().optional(),
  billingEmail: z.string().optional(),
  purchaseOrder: z.string().optional(),
});

function optionalField(value: FormDataEntryValue | null) {
  return value && String(value).trim().length > 0 ? String(value) : undefined;
}

export async function createEnrollment(courseSessionId: string, formData: FormData) {
  try {
    const data = enrollmentSchema.parse({
      fullName: formData.get('fullName'),
      rut: formData.get('rut'),
      position: optionalField(formData.get('position')),
      company: optionalField(formData.get('company')),
      department: optionalField(formData.get('department')),
      phone: formData.get('phone'),
      email: formData.get('email'),
      education: optionalField(formData.get('education')),
      maintenanceExperience: optionalField(formData.get('maintenanceExperience')),
      techExperience: optionalField(formData.get('techExperience')),
      relatedCertifications: optionalField(formData.get('relatedCertifications')),
      previousCourses: optionalField(formData.get('previousCourses')),
      specialRequirements: optionalField(formData.get('specialRequirements')),
      businessName: optionalField(formData.get('businessName')),
      businessRut: optionalField(formData.get('businessRut')),
      coordinationContact: optionalField(formData.get('coordinationContact')),
      billingEmail: optionalField(formData.get('billingEmail')),
      purchaseOrder: optionalField(formData.get('purchaseOrder')),
    });

    const { enrollment, courseSlug } = await db.$transaction(async (tx) => {
      const session = await tx.courseSession.findUnique({ where: { id: courseSessionId } });
      if (!session) {
        throw new Error('SESSION_NOT_FOUND');
      }
      if (session.status === 'CERRADA' || session.status === 'FINALIZADA') {
        throw new Error('SESSION_CLOSED');
      }

      const hasSeat = session.seatsTaken < session.seatsTotal;
      const status: EnrollmentStatus = hasSeat ? 'INSCRITO' : 'LISTA_ESPERA';

      if (hasSeat) {
        await tx.courseSession.update({
          where: { id: courseSessionId },
          data: { seatsTaken: { increment: 1 } },
        });
      }

      const enrollment = await tx.enrollment.create({
        data: { ...data, courseSessionId, status },
      });

      return { enrollment, courseSlug: session.courseSlug };
    });

    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath(`/admin-panel/capacitaciones/sesiones/${courseSessionId}/inscritos`);
    revalidatePath(`/capacitaciones/${courseSlug}`);

    return { success: true, status: enrollment.status };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    if (error.message === 'SESSION_NOT_FOUND') {
      return { success: false, error: 'La sesión no existe' };
    }
    if (error.message === 'SESSION_CLOSED') {
      return { success: false, error: 'Las inscripciones para esta sesión están cerradas' };
    }
    console.error('Error creating enrollment:', error);
    return { success: false, error: 'Error al procesar la inscripción' };
  }
}

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus) {
  try {
    const { enrollment, courseSlug } = await db.$transaction(async (tx) => {
      const current = await tx.enrollment.findUnique({ where: { id } });
      if (!current) throw new Error('NOT_FOUND');

      const wasOccupying = SEAT_OCCUPYING.includes(current.status);
      const willOccupy = SEAT_OCCUPYING.includes(status);

      let session = await tx.courseSession.findUnique({ where: { id: current.courseSessionId } });
      if (!session) throw new Error('SESSION_NOT_FOUND');

      if (wasOccupying && !willOccupy) {
        session = await tx.courseSession.update({ where: { id: current.courseSessionId }, data: { seatsTaken: { decrement: 1 } } });
      } else if (!wasOccupying && willOccupy) {
        session = await tx.courseSession.update({ where: { id: current.courseSessionId }, data: { seatsTaken: { increment: 1 } } });
      }

      const enrollment = await tx.enrollment.update({ where: { id }, data: { status } });
      return { enrollment, courseSlug: session.courseSlug };
    });

    revalidatePath(`/admin-panel/capacitaciones/sesiones/${enrollment.courseSessionId}/inscritos`);
    revalidatePath('/admin-panel/capacitaciones');
    revalidatePath(`/capacitaciones/${courseSlug}`);
    return { success: true, enrollment };
  } catch (error) {
    return { success: false, error: 'Error al actualizar el estado' };
  }
}

export async function updateEnrollmentNotes(id: string, notes: string) {
  try {
    const enrollment = await db.enrollment.update({ where: { id }, data: { notes } });
    revalidatePath(`/admin-panel/capacitaciones/sesiones/${enrollment.courseSessionId}/inscritos`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al guardar la observación' };
  }
}

export async function deleteEnrollment(id: string) {
  try {
    const { enrollment, courseSlug } = await db.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.delete({ where: { id } });
      let session = await tx.courseSession.findUnique({ where: { id: enrollment.courseSessionId } });
      if (session && SEAT_OCCUPYING.includes(enrollment.status)) {
        session = await tx.courseSession.update({ where: { id: enrollment.courseSessionId }, data: { seatsTaken: { decrement: 1 } } });
      }
      return { enrollment, courseSlug: session?.courseSlug };
    });

    revalidatePath(`/admin-panel/capacitaciones/sesiones/${enrollment.courseSessionId}/inscritos`);
    revalidatePath('/admin-panel/capacitaciones');
    if (courseSlug) revalidatePath(`/capacitaciones/${courseSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar la inscripción' };
  }
}
