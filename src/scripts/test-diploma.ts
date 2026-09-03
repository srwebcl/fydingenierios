import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '../lib/db';
import { CourseDiplomaPDF } from '../components/pdf/CourseDiplomaPDF';
import * as fs from 'fs';

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: 'analisis-vibraciones-nivel-i' } });
  const courseCertificationText = course?.certificationText || 'ISO 18436-2';

  const data = {
    studentName: 'Test User',
    studentRut: '11111111-1',
    courseName: course?.title || 'Course',
    approvalType: 'PARTICIPACION' as any,
    scorePercent: undefined,
    courseDates: '2 al 3 de septiembre del 2026',
    courseHours: 24,
    certificateNumber: '12345',
    issueDate: '2026-09-03',
    validationCode: '12345',
    qrBase64: '',
    logoBase64: '',
    signatureDanielBase64: '',
    signatureAlamiroBase64: '',
    timbreBase64: '',
    certificationText: courseCertificationText
  };
  
  const pdfElement = React.createElement(CourseDiplomaPDF, { data });
  const pdfBuffer = await renderToBuffer(pdfElement as any);
  fs.writeFileSync('test-diploma.pdf', pdfBuffer);
  console.log('PDF rendered to test-diploma.pdf');
}

main().catch(console.error).finally(() => prisma.$disconnect());
