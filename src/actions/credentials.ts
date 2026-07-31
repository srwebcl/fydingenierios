'use server'

import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import React from 'react';
import { generateQR } from '@/lib/qr';
import { sendCredentialEmail } from '@/lib/mail';
import { ApprovalType, CredentialType } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

// Helper to get logo buffer
async function getLogoBuffer(): Promise<Buffer | undefined> {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.jpeg');
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

    revalidatePath('/admin-panel/servicios/informes');
    return { success: true, validationCode: credential.validationCode };
  } catch (error: any) {
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
  correlative?: string;
};

export type CourseDiplomaBulkData = {
  courseSessionId?: string; // Optional now
  courseSlug: string;
  abbreviation: string;
  courseDates: string;
  courseHours: number;
  participants: CourseParticipantData[];
  issueDate: string;
};

export async function issueCourseDiploma(data: CourseDiplomaBulkData) {
  if (!data.courseSlug || !data.abbreviation || !data.courseDates || !data.courseHours || !data.participants || data.participants.length === 0) {
    return { success: false, error: 'Faltan datos requeridos o participantes' };
  }

  const issueDate = new Date(data.issueDate || Date.now());
  const year = issueDate.getFullYear();
  const results = [];

  const logoBuffer = await getLogoBuffer();
  const logoBase64 = logoBuffer ? `data:image/jpeg;base64,${logoBuffer.toString('base64')}` : undefined;

  let signatureDanielBase64, signatureAlamiroBase64;
  try {
    const fs = await import('fs');
    const path = await import('path');
    const danielPath = path.join(process.cwd(), 'public', 'firma-daniel.png');
    const alamiroPath = path.join(process.cwd(), 'public', 'firma-alamiro.png');
    if (fs.existsSync(danielPath)) {
      signatureDanielBase64 = `data:image/png;base64,${fs.readFileSync(danielPath).toString('base64')}`;
    }
    if (fs.existsSync(alamiroPath)) {
      signatureAlamiroBase64 = `data:image/png;base64,${fs.readFileSync(alamiroPath).toString('base64')}`;
    }
  } catch (err) {
    console.warn('Error cargando firmas SVG:', err);
  }

  // Obtener el título real del curso desde la base de datos
  let courseName = data.courseSlug;
  try {
    const course = await prisma.course.findUnique({ where: { slug: data.courseSlug } });
    if (course) {
      courseName = course.title;
    } else {
      // Fallback
      const courseNameMap: Record<string, string> = {
        'analisis-de-vibraciones': 'Análisis Avanzado de Vibraciones e Interpretación de Espectros',
        'alineamiento-de-ejes': 'Alineamiento Láser',
        'balanceo-de-equipos-rotativos': 'Balanceo Dinámico',
        'termografia-infrarroja': 'Termografía Infrarroja',
      };
      courseName = courseNameMap[data.courseSlug] || data.courseSlug;
    }
  } catch (err) {
    console.error('Error buscando curso en BD:', err);
  }

  for (const participant of data.participants) {
    try {
      const validationCode = generateValidationCode();

      // Transacción atómica por participante
      const credential = await prisma.$transaction(async (tx) => {
        // Resolvemos el prefijo dinámicamente consultando la categoría del curso
        let abbreviation = data.abbreviation || 'GEN';
        
        // Fallback robusto por slug si no viene
        if (abbreviation === 'GEN') {
          const slugLower = data.courseSlug.toLowerCase();
          if (slugLower.includes('vibraciones')) abbreviation = 'VA';
          else if (slugLower.includes('alineamiento')) abbreviation = 'LA';
          else if (slugLower.includes('balanceo')) abbreviation = 'DB';
          else if (slugLower.includes('termografia')) abbreviation = 'IRT';
        }

        const course = await tx.course.findUnique({ where: { slug: data.courseSlug } });
        if (course) {
          const option = await tx.courseOption.findFirst({
            where: { type: 'CATEGORY', name: course.category }
          });
          if (option && option.abbreviation) {
            abbreviation = option.abbreviation;
          }
        }
        
        // Calcular número de certificado
        const prefix = `F&D-${abbreviation}-${year}-`;
        let certificateNumber;
        
        if (participant.correlative) {
          certificateNumber = `${prefix}${participant.correlative}`;
        } else {
          const lastCredential = await tx.credential.findFirst({
            where: { certificateNumber: { startsWith: prefix } },
            orderBy: { createdAt: 'desc' }
          });
          
          let correlativeNum = 1;
          if (lastCredential?.certificateNumber) {
            const parts = lastCredential.certificateNumber.split('-');
            const lastNum = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastNum)) {
              correlativeNum = lastNum + 1;
            }
          }
          certificateNumber = `${prefix}${correlativeNum.toString().padStart(3, '0')}`;
        }

        const holder = await tx.holder.upsert({
          where: { rut: participant.rut },
          update: { fullName: participant.fullName, company: participant.company || 'Independiente', email: participant.email },
          create: { rut: participant.rut, fullName: participant.fullName, company: participant.company || 'Independiente', email: participant.email }
        });

        return await tx.credential.create({
          data: {
            holderId: holder.id,
            type: CredentialType.DIPLOMA_CAPACITACION,
            courseSessionId: data.courseSessionId || null,
            courseSlug: data.courseSlug,
            approvalType: participant.approvalType,
            scorePercent: participant.scorePercent,
            courseDates: data.courseDates,
            courseHours: data.courseHours,
            certificateNumber,
            issueDate,
            expiryDate: null,
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
      
      // Convertimos todo a Base64 para pasarlo al PDF
      const timbrePath = path.join(process.cwd(), 'public', 'timbre.png');
      let timbreBase64 = '';
      try {
        const timbreBuffer = await fs.readFile(timbrePath);
        timbreBase64 = `data:image/png;base64,${timbreBuffer.toString('base64')}`;
      } catch (e) {
        // file doesn't exist or can't be read
      }

      const pdfElement = React.createElement(CourseDiplomaPDF, {
        data: {
          studentName: credential.holder.fullName,
          studentRut: credential.holder.rut,
          courseName,
          approvalType: credential.approvalType!,
          scorePercent: credential.scorePercent,
          courseDates: credential.courseDates || '',
          courseHours: credential.courseHours || 0,
          certificateNumber: credential.certificateNumber || '',
          issueDate: credential.issueDate.toLocaleDateString('es-CL'),
          validationCode: credential.validationCode,
          qrBase64,
          logoBase64,
          signatureDanielBase64,
          signatureAlamiroBase64,
          timbreBase64
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

  revalidatePath('/admin-panel/capacitaciones/diplomas');
  return { success: true, results };
}

export async function updateCourseDiploma(credentialId: string, formData: any) {
  try {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
      include: { holder: true }
    });

    if (!credential) return { success: false, error: 'Credencial no encontrada' };

    await prisma.$transaction(async (tx) => {
      await tx.holder.update({
        where: { id: credential.holderId },
        data: {
          fullName: formData.fullName,
          rut: formData.rut,
          email: formData.email
        }
      });
      let updatedCertificateNumber = credential.certificateNumber;
      if (formData.correlative) {
        if (credential.certificateNumber && credential.certificateNumber.includes('-')) {
          const parts = credential.certificateNumber.split('-');
          parts[parts.length - 1] = formData.correlative;
          updatedCertificateNumber = parts.join('-');
        } else {
          // Reconstruir prefijo si faltaba
          let abbreviation = 'GEN';
          
          if (credential.courseSlug) {
            const slugLower = credential.courseSlug.toLowerCase();
            if (slugLower.includes('vibraciones')) abbreviation = 'VA';
            else if (slugLower.includes('alineamiento')) abbreviation = 'LA';
            else if (slugLower.includes('balanceo')) abbreviation = 'DB';
            else if (slugLower.includes('termografia')) abbreviation = 'IRT';

            const course = await tx.course.findUnique({ where: { slug: credential.courseSlug } });
            if (course) {
              const option = await tx.courseOption.findFirst({
                where: { type: 'CATEGORY', name: course.category }
              });
              if (option && option.abbreviation) {
                abbreviation = option.abbreviation;
              }
            }
          }
          
          const year = credential.createdAt.getFullYear();
          updatedCertificateNumber = `F&D-${abbreviation}-${year}-${formData.correlative}`;
        }
      }

      await tx.credential.update({
        where: { id: credentialId },
        data: {
          courseDates: formData.courseDates,
          courseHours: parseInt(formData.courseHours, 10),
          certificateNumber: updatedCertificateNumber
        }
      });
    });

    revalidatePath('/admin-panel/capacitaciones/diplomas');
    return { success: true };
  } catch (error) {
    console.error('Error updating diploma:', error);
    return { success: false, error: 'Error al actualizar diploma' };
  }
}

export async function generateDiplomaPdfBase64(credentialId: string) {
  try {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
      include: { holder: true }
    });

    if (!credential) return { success: false, error: 'No encontrado' };

    const logoBuffer = await getLogoBuffer();
    const logoBase64 = logoBuffer ? `data:image/jpeg;base64,${logoBuffer.toString('base64')}` : undefined;

    let signatureDanielBase64, signatureAlamiroBase64;
    try {
      const fs = await import('fs');
      const path = await import('path');
      const danielPath = path.join(process.cwd(), 'public', 'firma-daniel.png');
      const alamiroPath = path.join(process.cwd(), 'public', 'firma-alamiro.png');
      if (fs.existsSync(danielPath)) {
        signatureDanielBase64 = `data:image/png;base64,${fs.readFileSync(danielPath).toString('base64')}`;
      }
      if (fs.existsSync(alamiroPath)) {
        signatureAlamiroBase64 = `data:image/png;base64,${fs.readFileSync(alamiroPath).toString('base64')}`;
      }
    } catch (err) {}

    let courseName = credential.courseSlug!;
    try {
      const course = await prisma.course.findUnique({ where: { slug: credential.courseSlug! } });
      if (course) {
        courseName = course.title;
      } else {
        const courseNameMap: Record<string, string> = {
          'analisis-de-vibraciones': 'Análisis Avanzado de Vibraciones e Interpretación de Espectros',
          'alineamiento-de-ejes': 'Alineamiento Láser',
          'balanceo-de-equipos-rotativos': 'Balanceo Dinámico',
          'termografia-infrarroja': 'Termografía Infrarroja',
        };
        courseName = courseNameMap[credential.courseSlug!] || credential.courseSlug!;
      }
    } catch (err) {}

    const qrBase64 = await generateQR(credential.validationCode);

    const { renderToBuffer } = await import('@react-pdf/renderer');
    // Convertimos a base64
    const timbrePath = path.join(process.cwd(), 'public', 'timbre.png');
    let timbreBase64 = '';
    try {
      const timbreBuffer = await fs.readFile(timbrePath);
      timbreBase64 = `data:image/png;base64,${timbreBuffer.toString('base64')}`;
    } catch(e) {
      // file doesn't exist or can't be read
    }

    const { CourseDiplomaPDF } = await import('@/components/pdf/CourseDiplomaPDF');
    const React = await import('react');
    
    const pdfElement = React.createElement(CourseDiplomaPDF, {
      data: {
        studentName: credential.holder.fullName,
        studentRut: credential.holder.rut,
        courseName,
        approvalType: credential.approvalType!,
        scorePercent: credential.scorePercent,
        courseDates: credential.courseDates || '',
        courseHours: credential.courseHours || 0,
        certificateNumber: credential.certificateNumber || '',
        issueDate: credential.issueDate.toLocaleDateString('es-CL'),
        validationCode: credential.validationCode,
        qrBase64,
        logoBase64,
        signatureDanielBase64,
        signatureAlamiroBase64,
        timbreBase64
      }
    });

    const pdfBuffer = await renderToBuffer(pdfElement as any);
    return { success: true, base64: pdfBuffer.toString('base64') };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: 'Error interno al generar PDF' };
  }
}

export async function resendCourseDiploma(credentialId: string) {
  try {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
      include: { holder: true }
    });
    if (!credential) return { success: false, error: 'Credencial no encontrada' };

    const pdfRes = await generateDiplomaPdfBase64(credentialId);
    if (!pdfRes.success || !pdfRes.base64) return { success: false, error: 'No se pudo generar PDF' };
    const pdfBuffer = Buffer.from(pdfRes.base64, 'base64');
    
    const logoBuffer = await getLogoBuffer();
    await sendCredentialEmail(credential.holder.email, credential.holder.fullName, pdfBuffer, 'DIPLOMA_CAPACITACION', logoBuffer);
    
    return { success: true };
  } catch (error) {
    console.error('Error resending diploma:', error);
    return { success: false, error: 'Error al reenviar diploma' };
  }
}
