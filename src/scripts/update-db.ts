import { prisma } from '../lib/db';

const data = [
  {
    slug: 'analisis-vibraciones-nivel-i', 
    text: 'Este certificado acredita la participación y finalización de la capacitación. El curso se realizó durante los días {{fechas}}, con una duración total de {{horas}} horas, de acuerdo con el programa de formación técnica establecido por F&D Ingeniería en Mantenimiento y tomando como referencia los principios técnicos de la norma ISO 18436-2 para el monitoreo y diagnóstico de condición mediante análisis de vibraciones. Esta capacitación corresponde a formación técnica y no constituye ni otorga una certificación internacional de personal conforme a ISO 18436-2, en el programa:'
  },
  {
    slug: 'analisis-de-vibraciones-nivel-ii',
    text: 'Este certificado acredita la participación y finalización de la capacitación. El curso se realizó durante los días {{fechas}}, con una duración total de {{horas}} horas, de acuerdo con el programa de formación técnica establecido por F&D Ingeniería en Mantenimiento y tomando como referencia los principios técnicos de la norma ISO 18436-2 para el monitoreo, análisis y diagnóstico de maquinaria mediante vibraciones. Esta capacitación corresponde a formación técnica y no constituye ni otorga una certificación internacional de personal conforme a ISO 18436-2, en el programa:'
  },
  {
    slug: 'alineamiento-laser-de-maquinaria',
    text: 'Este certificado acredita la participación y finalización de la capacitación. El curso se realizó durante los días {{fechas}}, con una duración total de {{horas}} horas, de acuerdo con el programa de formación técnica establecido por F&D Ingeniería en Mantenimiento y basado en buenas prácticas para la medición, evaluación y corrección del desalineamiento en maquinaria rotativa, en el programa:'
  },
  {
    slug: 'balanceo-din-mico',
    text: 'Este certificado acredita la participación y finalización de la capacitación. El curso se realizó durante los días {{fechas}}, con una duración total de {{horas}} horas, de acuerdo con el programa de formación técnica establecido por F&D Ingeniería en Mantenimiento y tomando como referencia los principios técnicos de la serie de normas ISO 21940, relacionados con los requisitos de calidad de balanceo y la evaluación del desbalance residual en rotores, en el programa:'
  },
  {
    slug: 'termografia-nivel-1',
    text: 'Este certificado acredita la participación y finalización de la capacitación. El curso se realizó durante los días {{fechas}}, con una duración total de {{horas}} horas, de acuerdo con el programa de formación técnica establecido por F&D Ingeniería en Mantenimiento y tomando como referencia los principios técnicos de la norma ISO 18436-7 para el monitoreo de condición mediante termografía infrarroja. Esta capacitación corresponde a formación técnica y no constituye ni otorga una certificación internacional de personal conforme a ISO 18436-7 o ASNT, en el programa:'
  }
];

async function main() {
  for (const item of data) {
    const course = await prisma.course.findUnique({ where: { slug: item.slug } });
    if (course) {
       await prisma.course.update({
         where: { slug: item.slug },
         data: { certificationText: item.text }
       });
       console.log(`Updated ${item.slug}`);
    } else {
       console.log(`Missing course in DB: ${item.slug}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
