export type CourseModule = {
  title: string;
  topics: string[];
};

export type CourseFAQ = {
  question: string;
  answer: string;
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
};

export const courses: Course[] = [
  {
    slug: 'analisis-de-vibraciones-cat-1',
    title: 'Análisis de Vibraciones CAT I',
    shortDescription: 'Introducción al análisis de vibraciones mecánicas y monitoreo de condición según ISO 18436-2.',
    fullDescription: 'Este curso preparatorio entrega los fundamentos de la vibración, adquisición de datos y procesamiento de señales, basado en la normativa ISO 18436-2. Orientado a técnicos, mecánicos e ingenieros que se inician en el mantenimiento predictivo. Los participantes aprenderán a operar colectores de datos y a reconocer los patrones vibratorios de desbalanceo, desalineación y holguras.',
    durationHours: 32,
    includesDiploma: true,
    category: 'Confiabilidad',
    level: 'Introductorio',
    syllabus: [
      {
        title: 'Módulo 1: Principios de Vibración',
        topics: ['Concepto de vibración y movimiento armónico', 'Amplitud, frecuencia y fase', 'Unidades de medición (Desplazamiento, Velocidad, Aceleración)', 'Conversión de unidades y dominio del tiempo vs dominio de frecuencia']
      },
      {
        title: 'Módulo 2: Adquisición de Datos',
        topics: ['Tipos de transductores (Acelerómetros, Proximímetros)', 'Montaje de sensores e impacto en la medición', 'Rutas de recolección y configuración de equipos', 'Reconocimiento de mala toma de datos (Ski-slope)']
      },
      {
        title: 'Módulo 3: Análisis de Fallas Comunes',
        topics: ['Diagnóstico de Desbalanceo de Masas', 'Tipos de Desalineamiento (Angular, Paralelo)', 'Identificación de Holguras Mecánicas', 'Introducción a fallas de rodamientos de elemento rodante']
      }
    ],
    faqs: [
      { question: '¿Necesito conocimientos previos en vibraciones?', answer: 'No, este curso inicia desde cero y cubre todos los fundamentos físicos requeridos.' },
      { question: '¿El certificado está validado bajo norma ISO?', answer: 'El temario cumple con ISO 18436-2. El diploma entregado por FYD certifica la aprobación de la capacitación y es verificable mediante QR público.' },
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
