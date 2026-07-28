export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  deliverables: string[];
  normatives?: string[];
};

export const services: Service[] = [
  {
    slug: 'analisis-vibraciones',
    title: 'Análisis de Vibraciones',
    shortDescription: 'Diagnóstico y evaluación del estado mecánico de maquinaria rotativa mediante análisis espectral.',
    fullDescription: 'Servicio de monitoreo de condición orientado al diagnóstico y evaluación del estado mecánico de maquinaria rotativa mediante el análisis de vibraciones. Permite identificar fallas incipientes antes de que evolucionen a una falla funcional, optimizando la planificación del mantenimiento y aumentando la confiabilidad operacional.',
    benefits: [
      'Detección temprana de fallas.',
      'Reducción de detenciones no programadas.',
      'Incremento de la disponibilidad operacional.',
      'Optimización de costos de mantenimiento.',
      'Extensión de la vida útil de los activos.',
      'Priorización técnica de intervenciones.'
    ],
    deliverables: [
      'Informe técnico de diagnóstico.',
      'Espectros y tendencias de vibración.',
      'Evaluación de severidad.',
      'Identificación de modos de falla.',
      'Recomendaciones técnicas.',
      'Clasificación de criticidad.'
    ],
    normatives: [
      'ISO 18436-2',
      'ISO 17359',
      'ISO 20816',
      'ISO 13373'
    ]
  },
  {
    slug: 'termografia-infrarroja',
    title: 'Termografía Infrarroja',
    shortDescription: 'Inspección no destructiva de temperatura superficial en equipos eléctricos y mecánicos.',
    fullDescription: 'Inspección mediante cámaras termográficas para identificar anomalías térmicas en equipos eléctricos y mecánicos sin necesidad de detener la operación.',
    benefits: [
      'Prevención de fallas.',
      'Mayor seguridad operacional.',
      'Reducción de riesgos eléctricos.',
      'Optimización del mantenimiento.',
      'Detección de pérdidas energéticas.'
    ],
    deliverables: [
      'Informe termográfico.',
      'Imágenes IR y visibles.',
      'Clasificación de anomalías.',
      'Recomendaciones.',
      'Registro fotográfico.'
    ],
    normatives: [
      'ISO 18436-7',
      'NFPA 70B',
      'ISO 6781 (cuando corresponda)'
    ]
  },
  {
    slug: 'alineamiento-laser',
    title: 'Alineamiento Láser',
    shortDescription: 'Alineación de precisión láser para extender la vida útil de acoplamientos y rodamientos.',
    fullDescription: 'Corrección de la alineación entre ejes mediante sistemas láser de alta precisión para minimizar esfuerzos mecánicos y maximizar la confiabilidad.',
    benefits: [
      'Disminución de vibraciones.',
      'Mayor vida útil de rodamientos.',
      'Menor consumo energético.',
      'Reducción de fallas.',
      'Mayor disponibilidad.'
    ],
    deliverables: [
      'Informe antes y después.',
      'Valores de desalineamiento.',
      'Correcciones aplicadas.',
      'Registro fotográfico.',
      'Certificado de alineación.'
    ],
    normatives: [
      'ANSI/ASA S2.75',
      'ISO 20816 (como referencia de evaluación)'
    ]
  },
  {
    slug: 'balanceo-dinamico',
    title: 'Balanceo Dinámico',
    shortDescription: 'Balanceo in-situ de equipos rotativos para eliminar excesos de vibración.',
    fullDescription: 'Corrección del desbalance residual en componentes rotativos mediante técnicas de balanceo dinámico en terreno o taller.',
    benefits: [
      'Reducción de vibraciones.',
      'Mayor vida útil.',
      'Menor desgaste.',
      'Disminución del consumo energético.',
      'Mayor confiabilidad.'
    ],
    deliverables: [
      'Informe de balanceo.',
      'Registro de correcciones.',
      'Valores antes y después.',
      'Certificado de balanceo.'
    ],
    normatives: [
      'ISO 21940',
      'ISO 20816'
    ]
  },
  {
    slug: 'ingenieria-confiabilidad',
    title: 'Ingeniería de Confiabilidad y Gestión de Activos',
    shortDescription: 'Estrategias para optimizar la confiabilidad y mantenibilidad de activos industriales.',
    fullDescription: 'Desarrollo de estrategias para optimizar la confiabilidad, mantenibilidad y disponibilidad de los activos industriales mediante metodologías reconocidas internacionalmente.',
    benefits: [
      'Mayor disponibilidad.',
      'Reducción del costo del ciclo de vida.',
      'Optimización de planes de mantenimiento.',
      'Priorización de recursos.',
      'Mejora continua.'
    ],
    deliverables: [
      'Estudios de criticidad.',
      'Estrategias de mantenimiento.',
      'Matrices de riesgo.',
      'Informes técnicos.',
      'Planes de mejora.'
    ],
    normatives: [
      'ISO 55000',
      'ISO 55001',
      'ISO 55002',
      'SAE JA1011 (RCM)'
    ]
  },
  {
    slug: 'auditorias-tecnicas',
    title: 'Auditorías Técnicas de Mantenimiento Predictivo',
    shortDescription: 'Evaluación independiente del desempeño de programas de mantenimiento predictivo.',
    fullDescription: 'Evaluación independiente del desempeño de programas de mantenimiento predictivo, verificando cumplimiento técnico, metodológico y normativo.',
    benefits: [
      'Identificación de oportunidades de mejora.',
      'Estandarización.',
      'Mayor confiabilidad del programa.',
      'Mejora del desempeño del personal.',
      'Optimización de recursos.'
    ],
    deliverables: [
      'Informe de auditoría.',
      'Hallazgos.',
      'No conformidades.',
      'Plan de mejoras.',
      'Recomendaciones.'
    ],
    normatives: [
      'ISO 17359',
      'ISO 18436',
      'ISO 55001',
      'Buenas prácticas de mantenimiento predictivo.'
    ]
  },
  {
    slug: 'implementacion-programas',
    title: 'Implementación de Programas de Mantenimiento Predictivo',
    shortDescription: 'Diseño e implementación de programas de monitoreo de condición.',
    fullDescription: 'Diseño e implementación de programas de monitoreo de condición adaptados a la criticidad y necesidades operacionales de cada organización.',
    benefits: [
      'Implementación estructurada.',
      'Optimización de frecuencias.',
      'Integración de tecnologías.',
      'Mayor confiabilidad.',
      'Reducción de fallas.'
    ],
    deliverables: [
      'Plan maestro.',
      'Rutas de inspección.',
      'Matriz de activos.',
      'Procedimientos.',
      'Indicadores.',
      'Capacitación inicial.'
    ],
    normatives: [
      'ISO 17359',
      'ISO 55001',
      'ISO 18436'
    ]
  },
  {
    slug: 'asesorias-ingenieria',
    title: 'Asesorías e Ingeniería Especializada',
    shortDescription: 'Consultoría técnica para la toma de decisiones e investigación de fallas.',
    fullDescription: 'Servicio de consultoría técnica para apoyar la toma de decisiones en mantenimiento, confiabilidad, monitoreo de condición e investigación de fallas.',
    benefits: [
      'Soporte especializado.',
      'Soluciones basadas en evidencia.',
      'Optimización de recursos.',
      'Reducción de riesgos.',
      'Mayor confiabilidad operacional.'
    ],
    deliverables: [
      'Informes técnicos.',
      'Estudios de ingeniería.',
      'Análisis de causa raíz (RCA).',
      'Especificaciones técnicas.',
      'Planes de acción.',
      'Recomendaciones.'
    ],
    normatives: [
      'ISO 55001',
      'ISO 17359',
      'IEC 60300 (Gestión de la Confiabilidad)',
      'Metodologías RCA (RCA, FMEA, según el alcance del proyecto)'
    ]
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
