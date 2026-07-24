'use server'

import { prisma } from '@/lib/db';
import crypto from 'crypto';
import React from 'react';
import { generateQR } from '@/lib/qr';
import { sendCredentialEmail } from '@/lib/mail';
import { ApprovalType, CredentialType, WeldingProcess } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

// Helper to get logo buffer
async function getLogoBuffer(): Promise<Buffer | undefined> {
  try {
    // Assuming there's a logo at public/logo-fyd.png. We'll use a placeholder if not found.
    const logoPath = path.join(process.cwd(), 'public', 'logo-fyd.png');
    return await fs.readFile(logoPath);
  } catch (err) {
    console.warn('Logo no encontrado para PDF, usando solo texto.');
    return undefined;
  }
}

function generateValidationCode() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
}

export type WeldingQualificationData = {
  rut: string;
  fullName: string;
  company: string;
  email: string;
  weldingProcess: WeldingProcess;
  weldingStandard: string;
  weldingPosition: string;
  issueDate: string;
};

export async function issueWeldingQualification(data: WeldingQualificationData) {
  if (!data.rut || !data.fullName || !data.email || !data.weldingProcess || !data.issueDate) {
    return { success: false, error: 'Faltan datos requeridos' };
  }

  try {
    const issueDate = new Date(data.issueDate);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const validationCode = generateValidationCode();

    // Transacción Prisma
    const [holder, credential] = await prisma.$transaction([
      prisma.holder.upsert({
        where: { rut: data.rut },
        update: { fullName: data.fullName, company: data.company || 'Independiente', email: data.email },
        create: { rut: data.rut, fullName: data.fullName, company: data.company || 'Independiente', email: data.email }
      }),
      prisma.credential.create({
        data: {
          holder: { connect: { rut: data.rut } },
          type: CredentialType.CALIFICACION_SOLDADOR,
          weldingProcess: data.weldingProcess,
          weldingStandard: data.weldingStandard,
          weldingPosition: data.weldingPosition,
          issueDate,
          expiryDate,
          validationCode,
          status: 'VIGENTE'
        }
      })
    ]);

    // Generar PDF y enviar correo
    const logoBuffer = await getLogoBuffer();
    const logoBase64 = logoBuffer ? `data:image/png;base64,${logoBuffer.toString('base64')}` : undefined;
    const qrBase64 = await generateQR(credential.validationCode);

    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { WeldingQualificationPDF } = await import('@/components/pdf/WeldingQualificationPDF');
    
    const pdfElement = React.createElement(WeldingQualificationPDF, {
      data: {
        welderName: holder.fullName,
        welderRut: holder.rut,
        process: credential.weldingProcess!,
        standard: credential.weldingStandard || '',
        position: credential.weldingPosition || '',
        issueDate: credential.issueDate.toLocaleDateString('es-CL'),
        expiryDate: credential.expiryDate!.toLocaleDateString('es-CL'),
        validationCode: credential.validationCode,
        qrBase64,
        logoBase64
      }
    });

    const pdfBuffer = await renderToBuffer(pdfElement as any);
    
    await sendCredentialEmail(holder.email, holder.fullName, pdfBuffer, 'CALIFICACION_SOLDADOR', logoBuffer);

    return { success: true, validationCode: credential.validationCode };
  } catch (error) {
    console.error('Error issuing welding qualification:', error);
    return { success: false, error: 'Error interno al generar calificación' };
  }
}

export type CourseParticipantData = {
  rut: string;
  fullName: string;
  company: string;
  email: string;
  approvalType: ApprovalType;
  scorePercent?: number;
};

export type CourseDiplomaBulkData = {
  courseSessionId: string;
  courseSlug: string;
  participants: CourseParticipantData[];
  issueDate: string;
};

export async function issueCourseDiploma(data: CourseDiplomaBulkData) {
  if (!data.courseSessionId || !data.courseSlug || !data.participants || data.participants.length === 0) {
    return { success: false, error: 'Faltan datos requeridos o participantes' };
  }

  const issueDate = new Date(data.issueDate || Date.now());
  const results = [];

  const logoBuffer = await getLogoBuffer();
  const logoBase64 = logoBuffer ? `data:image/png;base64,${logoBuffer.toString('base64')}` : undefined;

  // Resolvemos nombres de cursos estáticos. Como esto es backend, usaremos un mapeo simple o el slug
  const courseNameMap: Record<string, string> = {
    'analisis-de-vibraciones': 'Análisis de Vibraciones',
    'alineamiento-de-ejes': 'Alineamiento de Ejes',
    'balanceo-de-equipos-rotativos': 'Balanceo de Equipos Rotativos',
    'termografia-infrarroja': 'Termografía Infrarroja',
  };
  const courseName = courseNameMap[data.courseSlug] || data.courseSlug;

  for (const participant of data.participants) {
    try {
      const validationCode = generateValidationCode();

      // Transacción atómica por participante
      const credential = await prisma.$transaction(async (tx) => {
        const holder = await tx.holder.upsert({
          where: { rut: participant.rut },
          update: { fullName: participant.fullName, company: participant.company || 'Independiente', email: participant.email },
          create: { rut: participant.rut, fullName: participant.fullName, company: participant.company || 'Independiente', email: participant.email }
        });

        return await tx.credential.create({
          data: {
            holderId: holder.id,
            type: CredentialType.DIPLOMA_CAPACITACION,
            courseSessionId: data.courseSessionId,
            courseSlug: data.courseSlug,
            approvalType: participant.approvalType,
            scorePercent: participant.scorePercent,
            issueDate,
            expiryDate: null, // Los diplomas no vencen
            validationCode,
            status: 'VIGENTE'
          },
          include: { holder: true }
        });
      });

      // Generar PDF y enviar correo
      const qrBase64 = await generateQR(credential.validationCode);
      const { renderToBuffer } = await import('@react-pdf/renderer');
      const { CourseDiplomaPDF } = await import('@/components/pdf/CourseDiplomaPDF');
      
      const pdfElement = React.createElement(CourseDiplomaPDF, {
        data: {
          studentName: credential.holder.fullName,
          studentRut: credential.holder.rut,
          courseName,
          approvalType: credential.approvalType!,
          scorePercent: credential.scorePercent,
          issueDate: credential.issueDate.toLocaleDateString('es-CL'),
          validationCode: credential.validationCode,
          qrBase64,
          logoBase64
        }
      });

      const pdfBuffer = await renderToBuffer(pdfElement as any);
      
      await sendCredentialEmail(credential.holder.email, credential.holder.fullName, pdfBuffer, 'DIPLOMA_CAPACITACION', logoBuffer);

      results.push({ rut: participant.rut, success: true, validationCode: credential.validationCode });
    } catch (err) {
      console.error(`Error emitiendo diploma para ${participant.rut}:`, err);
      results.push({ rut: participant.rut, success: false, error: 'Error al emitir diploma' });
    }
  }

  return { success: true, results };
}
