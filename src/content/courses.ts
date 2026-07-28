export type CourseModule = {
  title: string;
  topics: string[];
};

export type CourseFAQ = {
  question: string;
  answer: string;
};

export type CourseInstructor = {
  name: string;
  title: string;
  description: string;
};

export type Course = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  durationHours: number;
  includesDiploma: boolean;
  category: 'Confiabilidad' | 'Alineamiento' | 'Termografía' | 'General';
  level: 'Introductorio' | 'Intermedio' | 'Avanzado';
  syllabus: CourseModule[];
  faqs: CourseFAQ[];
  whatYouWillLearn?: string[];
  modality?: string;
  evaluation?: string;
  material?: string;
  certificationText?: string;
  audience?: string;
  whyChooseUs?: string[];
  instructor?: CourseInstructor;
};

export const courses: Course[] = [
  {
    slug: 'analisis-vibraciones-nivel-i',
    title: 'Análisis de Vibraciones Nivel I',
    shortDescription: 'Fundamentos para implementar y desarrollar actividades de monitoreo de condición en maquinaria rotativa.',
    fullDescription: 'El curso Análisis de Vibraciones Nivel I entrega los conocimientos fundamentales para implementar y desarrollar actividades de monitoreo de condición en maquinaria rotativa. Los participantes aprenderán los principios del análisis de vibraciones, el uso de instrumentación especializada, la interpretación básica de espectros y la identificación de los modos de falla más comunes, mediante una metodología que combina teoría, práctica y casos reales de la industria.',
    durationHours: 24,
    includesDiploma: true,
    category: 'Confiabilidad',
    level: 'Introductorio',
    modality: 'Presencial / Online en vivo',
    evaluation: 'Teórica y práctica',
    material: 'Manual digital y material complementario',
    certificationText: 'Certificado de Aprobación emitido por F&D Ingeniería',
    audience: 'Este programa está dirigido a técnicos, mecánicos, ingenieros, supervisores, planificadores, profesionales de confiabilidad y personal de mantenimiento que deseen adquirir conocimientos en monitoreo de condición mediante análisis de vibraciones. No se requieren conocimientos previos.',
    whatYouWillLearn: [
      'Fundamentos del análisis de vibraciones.',
      'Principios físicos de la vibración mecánica.',
      'Uso correcto de sensores e instrumentación.',
      'Configuración de rutas de inspección.',
      'Interpretación básica de espectros FFT.',
      'Identificación de los principales modos de falla.',
      'Evaluación de la condición de maquinaria rotativa.',
      'Elaboración de recomendaciones técnicas.'
    ],
    whyChooseUs: [
      'Formación basada en casos reales.',
      'Enfoque práctico orientado a la industria.',
      'Uso de instrumentación profesional.',
      'Material técnico actualizado.',
      'Instructor con amplia experiencia en mantenimiento predictivo.',
      'Certificado verificable mediante código QR y código único.'
    ],
    instructor: {
      name: 'Alamiro Andrés Fernández Huenuqueo',
      title: 'Ingeniero Civil Industrial, Magíster en Gestión de Organizaciones',
      description: 'Especialista en mantenimiento predictivo con más de 15 años de experiencia en la industria minera y de procesos. Analista de Vibraciones Categoría IV conforme a ISO 18436-2 y Director Académico de F&D Ingeniería, con experiencia en diagnóstico de maquinaria crítica, implementación de programas de monitoreo de condición y formación técnica de profesionales.'
    },
    syllabus: [
      {
        title: 'Programa del Curso',
        topics: [
          'Estrategias de mantenimiento y monitoreo de condición.',
          'Fundamentos del análisis de vibraciones.',
          'Instrumentación y sensores.',
          'Recolección y adquisición de datos.',
          'Normativa internacional aplicable.',
          'Introducción al diagnóstico de fallas.',
          'Taller práctico y análisis de casos.'
        ]
      }
    ],
    faqs: [
      { question: '¿Necesito conocimientos previos en vibraciones?', answer: 'No, este curso inicia desde cero y cubre todos los fundamentos físicos requeridos.' },
      { question: '¿El certificado está validado bajo norma ISO?', answer: 'El temario cumple con ISO 18436-2. El diploma entregado por F&D certifica la aprobación de la capacitación y es verificable mediante QR público.' },
      { question: '¿Se entrega material de estudio?', answer: 'Sí, entregamos un manual técnico impreso y acceso a plataforma digital con casos de estudio y señales de ejemplo.' }
    ]
  },
  {
    slug: 'alineamiento-laser-de-maquinaria',
    title: 'Alineamiento Láser de Maquinaria Rotativa',
    shortDescription: 'Técnicas teóricas y prácticas para el alineamiento de precisión en ejes.',
    fullDescription: 'Curso teórico-práctico enfocado en diagnosticar y corregir la desalineación de ejes, comprender tolerancias de acoplamientos, el efecto del pie cojo (Soft Foot) y el crecimiento térmico. Los asistentes trabajarán directamente con equipos de alineación láser simulando condiciones reales de terreno.',
    durationHours: 16,
    includesDiploma: true,
    category: 'Alineamiento',
    level: 'Intermedio',
    syllabus: [
      {
        title: 'Módulo 1: Fundamentos de Alineamiento',
        topics: ['Consecuencias de la desalineación', 'Tipos de desalineación y tolerancia angular/paralela', 'Inspecciones previas al alineamiento (Runout, bases)']
      },
      {
        title: 'Módulo 2: Pie Cojo (Soft Foot)',
        topics: ['Identificación de pie cojo angular y paralelo', 'Consecuencias en la deformación de la carcasa', 'Procedimientos de corrección con shims calibrados']
      },
      {
        title: 'Módulo 3: Práctica con Equipo Láser',
        topics: ['Configuración de dimensiones del tren de máquinas', 'Método de reloj comparador vs láser', 'Compensación de crecimiento térmico', 'Generación de reporte de tolerancias finales']
      }
    ],
    faqs: [
      { question: '¿Cuánta práctica incluye el curso?', answer: 'Es un curso 60% práctico. Disponemos de bancos de prueba (skids) donde los alumnos ejecutan el alineamiento ellos mismos.' },
      { question: '¿Qué marcas de equipos láser usan?', answer: 'Las prácticas se realizan con equipos líderes en la industria (ej. PRUFTECHNIK, Fixturlaser) para garantizar un aprendizaje transversal.' }
    ]
  },
  {
    slug: 'termografia-nivel-1',
    title: 'Termografía Nivel I',
    shortDescription: 'Principios de la termografía infrarroja aplicada al mantenimiento industrial.',
    fullDescription: 'Formación en los principios de calor, temperatura y transferencia térmica. Los asistentes aprenderán la correcta operación de cámaras infrarrojas, compensación de emisividad y realización de inspecciones cualitativas en sistemas eléctricos, mecánicos y refractarios.',
    durationHours: 24,
    includesDiploma: true,
    category: 'Termografía',
    level: 'Introductorio',
    syllabus: [
      {
        title: 'Módulo 1: Teoría Infrarroja',
        topics: ['Espectro electromagnético e Infrarrojo', 'Transferencia de calor (Conducción, Convección, Radiación)', 'Conceptos de Emisividad, Reflectividad y Transmisividad']
      },
      {
        title: 'Módulo 2: Operación de Equipos',
        topics: ['Ajuste térmico y enfoque espacial', 'Compensación de fondo reflejado', 'Selección de paletas de color para análisis']
      },
      {
        title: 'Módulo 3: Aplicaciones Industriales',
        topics: ['Inspección en tableros y subestaciones eléctricas', 'Termografía en motores y descansos mecánicos', 'Inspección de trampas de vapor e isolación', 'Criterios de severidad y elaboración de reportes']
      }
    ],
    faqs: [
      { question: '¿Debo llevar mi propia cámara térmica?', answer: 'No es obligatorio. Proveemos cámaras para las sesiones prácticas, pero si su empresa cuenta con una, recomendamos llevarla para aprender a configurarla correctamente.' },
      { question: '¿Este curso aplica solo para eléctricos?', answer: 'No. El temario cubre aplicaciones tanto eléctricas (70%) como mecánicas (30%), siendo de gran utilidad para toda la planta.' }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}
