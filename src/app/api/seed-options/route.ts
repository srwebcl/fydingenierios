import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  await prisma.courseOption.createMany({
    data: [
      { type: 'CATEGORY', name: 'Termografía', abbreviation: 'IRT' },
      { type: 'CATEGORY', name: 'Análisis de vibraciones', abbreviation: 'VA' },
      { type: 'CATEGORY', name: 'Alineamiento láser', abbreviation: 'LA' },
      { type: 'CATEGORY', name: 'Balanceo dinámico', abbreviation: 'DB' },
      { type: 'LEVEL', name: 'Nivel I' },
      { type: 'LEVEL', name: 'Nivel II' },
      { type: 'LEVEL', name: 'Nivel III' },
      { type: 'LEVEL', name: 'Avanzado' },
      { type: 'LEVEL', name: 'Introductorio' },
      { type: 'MODALITY', name: 'Presencial' },
      { type: 'MODALITY', name: 'Online en Vivo' },
      { type: 'MODALITY', name: 'E-Learning Asincrónico' }
    ],
    skipDuplicates: true
  });
  return NextResponse.json({ success: true });
}
