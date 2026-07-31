import { NextResponse } from 'next/server';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { prisma } from '@/lib/db';
import { PaymentStatus, CredentialType } from '@prisma/client';
import { generateQR } from '@/lib/qr';
import { sendCredentialEmail } from '@/lib/mail';
import React from 'react';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token_ws = formData.get('token_ws') as string;
    const tbk_token = formData.get('TBK_TOKEN') as string;

    // Usuario canceló el pago
    if (tbk_token) {
      await prisma.credentialRecoveryPayment.updateMany({
        where: { webpayToken: tbk_token, status: PaymentStatus.INICIADA },
        data: { status: PaymentStatus.RECHAZADA }
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/certificados?error=pago_cancelado`);
    }

    if (!token_ws) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/certificados?error=token_invalido`);
    }

    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const response = await tx.commit(token_ws);

    const payment = await prisma.credentialRecoveryPayment.findFirst({
      where: { webpayToken: token_ws },
      include: { credential: { include: { holder: true, courseSession: true } } }
    });

    if (!payment) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/certificados?error=pago_no_encontrado`);
    }

    if (response.status === 'AUTHORIZED' && response.response_code === 0) {
      await prisma.credentialRecoveryPayment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.APROBADA }
      });

      // Regenerar PDF y re-enviar
      const cred = payment.credential;
      const holder = cred.holder;
      
      const qrBase64 = await generateQR(cred.validationCode);
      let logoBuffer: Buffer | undefined;
      try {
        logoBuffer = await fs.readFile(path.join(process.cwd(), 'public', 'logo.jpeg'));
      } catch(e) {}
      
      const logoBase64 = logoBuffer ? `data:image/jpeg;base64,${logoBuffer.toString('base64')}` : undefined;
      
      const { renderToBuffer } = await import('@react-pdf/renderer');
      let pdfElement;

      if (cred.type === CredentialType.INFORME_SERVICIO) {
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
        
        pdfElement = React.createElement(ServiceReportPDF, {
          data: {
            evaluatorName: holder.fullName,
            evaluatorRut: holder.rut,
            serviceName: serviceNameMap[cred.serviceSlug as string] || cred.serviceSlug as string,
            clientCompany: cred.clientCompany || '',
            equipmentTag: cred.equipmentTag || 'N/A',
            reportTitle: cred.reportTitle || '',
            findingsSummary: cred.findingsSummary || '',
            issueDate: cred.issueDate.toLocaleDateString('es-CL'),
            validationCode: cred.validationCode,
            qrBase64,
            logoBase64
          }
        });
      } else {
        const { CourseDiplomaPDF } = await import('@/components/pdf/CourseDiplomaPDF');
        let courseName = cred.courseSlug!;
        try {
          const course = await prisma.course.findUnique({ where: { slug: cred.courseSlug! } });
          if (course) {
            courseName = course.title;
          } else {
            const courseNameMap: Record<string, string> = {
              'analisis-de-vibraciones': 'Análisis Avanzado de Vibraciones e Interpretación de Espectros',
              'alineamiento-de-ejes': 'Alineamiento Láser',
              'balanceo-de-equipos-rotativos': 'Balanceo Dinámico',
              'termografia-infrarroja': 'Termografía Infrarroja',
            };
            courseName = courseNameMap[cred.courseSlug!] || cred.courseSlug!;
          }
        } catch (err) {}

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

        pdfElement = React.createElement(CourseDiplomaPDF, {
          data: {
            studentName: holder.fullName,
            studentRut: holder.rut,
            courseName,
            approvalType: cred.approvalType!,
            scorePercent: cred.scorePercent,
            courseDates: cred.courseDates || '',
            courseHours: cred.courseHours || 0,
            certificateNumber: cred.certificateNumber || '',
            issueDate: cred.issueDate.toLocaleDateString('es-CL'),
            validationCode: cred.validationCode,
            qrBase64,
            logoBase64,
            signatureDanielBase64,
            signatureAlamiroBase64
          }
        });
      }

      const pdfBuffer = await renderToBuffer(pdfElement as any);
      await sendCredentialEmail(holder.email, holder.fullName, pdfBuffer, cred.type, logoBuffer);

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/certificados?code=${cred.validationCode}&recovery=success`);
    } else {
      await prisma.credentialRecoveryPayment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.RECHAZADA }
      });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/certificados?error=pago_rechazado`);
    }
  } catch (error) {
    console.error('Error en commit Webpay:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/certificados?error=error_interno`);
  }
}
