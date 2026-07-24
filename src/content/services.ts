export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: 'analisis-de-vibraciones',
    title: 'Análisis de Vibraciones',
    shortDescription: 'Detección temprana de fallas mecánicas en equipos rotativos mediante análisis espectral.',
    fullDescription: 'El Análisis de Vibraciones permite monitorear el estado de los componentes mecánicos de sus equipos rotativos, detectando desbalanceos, desalineamientos, holguras, fallas en rodamientos y engranajes antes de que ocurra una avería funcional. Nuestro servicio incluye reportes detallados bajo normativas internacionales aplicables.',
    benefits: [
      'Detección de fallas incipientes meses antes del fallo catastrófico.',
      'Reducción drástica del lucro cesante por paradas no programadas.',
      'Optimización del inventario de repuestos al conocer el desgaste real.',
      'Aumento directo en la Confiabilidad y Disponibilidad de la planta.'
    ],
    deliverables: [
      'Informe técnico con diagnóstico espectral y formas de onda.',
      'Análisis de tendencias de severidad vibratoria (Norma ISO 20816).',
      'Recomendaciones correctivas priorizadas (cambio de rodamientos, alineación, etc.).'
    ]
  },
  {
    slug: 'termografia-infrarroja',
    title: 'Termografía Infrarroja',
    shortDescription: 'Inspección no destructiva de temperatura superficial en equipos eléctricos y mecánicos.',
    fullDescription: 'Mediante el uso de cámaras termográficas de alta resolución, identificamos puntos calientes, falsos contactos, sobrecargas en tableros eléctricos y problemas de fricción o lubricación en sistemas mecánicos sin interrumpir la operación.',
    benefits: [
      'Prevención de incendios y cortocircuitos en tableros eléctricos.',
      'Inspección segura sin necesidad de detener los equipos ni contacto físico.',
      'Identificación rápida de problemas de lubricación y fricción mecánica.',
      'Inspección de refractarios, aislaciones térmicas y trampas de vapor.'
    ],
    deliverables: [
      'Reporte fotográfico dual (térmico + visual).',
      'Clasificación de criticidad de hallazgos (Norma ASNT / NETA).',
      'Sugerencias de mantenimiento preventivo y acciones correctivas inmediatas.'
    ]
  },
  {
    slug: 'alineamiento-de-ejes',
    title: 'Alineamiento de Ejes',
    shortDescription: 'Alineación de precisión láser para extender la vida útil de acoplamientos y rodamientos.',
    fullDescription: 'Un porcentaje significativo de las fallas prematuras en máquinas rotativas se debe a la desalineación. Utilizamos equipos láser de última generación para corregir la alineación entre motor y máquina conducida, reduciendo el consumo energético y el desgaste.',
    benefits: [
      'Disminución del consumo de energía eléctrica hasta en un 10%.',
      'Extensión de vida útil de descansos, sellos mecánicos y acoplamientos.',
      'Reducción de niveles globales de vibración de la máquina.',
      'Prevención de fracturas de ejes por fatiga cíclica.'
    ],
    deliverables: [
      'Certificado de alineamiento digital generado por el equipo láser.',
      'Gráficos de tolerancias de acoplamiento finales alcanzadas.',
      'Verificación y corrección de "Pie Cojo" (Soft Foot) antes de alinear.'
    ]
  },
  {
    slug: 'calificacion-de-soldadores',
    title: 'Calificación de Soldadores',
    shortDescription: 'Certificación oficial de soldadores bajo normativas internacionales.',
    fullDescription: 'Calificación de operadores y procedimientos de soldadura de acuerdo a normas internacionales como AWS D1.1, ASME IX y API 1104. Incluye la emisión de certificado digital con validación por código QR.',
    benefits: [
      'Cumplimiento de estándares de calidad exigidos por mineras y mandantes.',
      'Trazabilidad digital inmediata de la vigencia del soldador vía portal web.',
      'Respaldo de inspectores calificados en ensayos no destructivos.',
      'Validación transparente a través de credenciales con código QR.'
    ],
    deliverables: [
      'Certificado de Calificación Oficial digital (PDF + QR).',
      'Registro en el Portal Público de Validación de FYD Ingenieros.',
      'Informes de inspección visual y ensayos (según aplique a la probeta).'
    ]
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
