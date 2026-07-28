'use server'

import { prisma } from '@/lib/db';
import crypto from 'crypto';
import React from 'react';
import { generateQR } from '@/lib/qr';
import { sendCredentialEmail } from '@/lib/mail';
import { ApprovalType, CredentialType } from '@prisma/client';
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

export type ServiceReportCredentialData = {
  rut: string;
  fullName: string;
  email: string;
  company: string;
  phone?: string;
  serviceSlug: string;
  clientCompany: string;
  equipmentTag?: string;
  reportTitle: string;
  findingsSummary?: string;
  issueDate: string;
};

export async function issueServiceReportCredential(data: ServiceReportCredentialData) {
  if (!data.rut || !data.fullName || !data.email || !data.serviceSlug || !data.clientCompany || !data.reportTitle || !data.issueDate) {
    return { success: false, error: 'Faltan datos requeridos' };
  }

  try {
    const issueDate = new Date(data.issueDate);
    const validationCode = generateValidationCode();

    // Transacción Prisma
    const [holder, credential] = await prisma.$transaction([
      prisma.holder.upsert({
        where: { rut: data.rut },
        update: { fullName: data.fullName, company: data.company || 'Independiente', email: data.email, phone: data.phone },
        create: { rut: data.rut, fullName: data.fullName, company: data.company || 'Independiente', email: data.email, phone: data.phone }
      }),
      prisma.credential.create({
        data: {
          holder: { connect: { rut: data.rut } },
          type: CredentialType.INFORME_SERVICIO,
          serviceSlug: data.serviceSlug,
          clientCompany: data.clientCompany,
          equipmentTag: data.equipmentTag,
          reportTitle: data.reportTitle,
          findingsSummary: data.findingsSummary,
          issueDate,
          expiryDate: null, // Informes no expiran
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
    const { ServiceReportPDF } = await import('@/components/pdf/ServiceReportPDF');
    
    // Mapeo simple de nombres de servicio
    const serviceNameMap: Record<string, string> = {
      'analisis-vibraciones': 'Análisis de Vibraciones',
      'termografia-infrarroja': 'Termografía Infrarroja',
      'alineamiento-laser': 'Alineamiento Láser',
      'balanceo-dinamico': 'Balanceo Dinámico',
      'ingenieria-confiabilidad': 'Ingeniería de Confiabilidad y Gestión de Activos',
      'auditorias-tecnicas': 'Auditorías Técnicas de Mantenimiento Predictivo',
      'implementacion-programas': 'Implementación de Programas de Mantenimiento Predictivo',
      'asesorias-ingenieria': 'Asesorías e Ingeniería Especializada'
    };
    const serviceName = serviceNameMap[data.serviceSlug] || data.serviceSlug;

    const pdfElement = React.createElement(ServiceReportPDF, {
      data: {
        evaluatorName: holder.fullName,
        evaluatorRut: holder.rut,
        serviceName,
        clientCompany: credential.clientCompany || '',
        equipmentTag: credential.equipmentTag || 'N/A',
        reportTitle: credential.reportTitle || '',
        findingsSummary: credential.findingsSummary || '',
        issueDate: credential.issueDate.toLocaleDateString('es-CL'),
        validationCode: credential.validationCode,
        qrBase64,
        logoBase64
      }
    });

    const pdfBuffer = await renderToBuffer(pdfElement as any);
    
    await sendCredentialEmail(holder.email, holder.fullName, pdfBuffer, 'INFORME_SERVICIO', logoBuffer);

    return { success: true, validationCode: credential.validationCode };
  } catch (error) {
    console.error('Error issuing service report credential:', error);
    return { success: false, error: 'Error interno al generar informe' };
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
