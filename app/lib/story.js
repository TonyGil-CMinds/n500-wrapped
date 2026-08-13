/**
 * Guion de la experiencia. Cada entrada es una "slide" de la historia.
 *
 * `kind` decide cómo la pinta StoryPlayer:
 *  - text    → una o varias líneas, la última puede ir destacada
 *  - stat    → un número grande que cuenta hasta `value`
 *  - list    → enumeración con entrada escalonada
 *  - reveal  → el momento de la selección (nombre de empresa + titular)
 *
 * `ms` es cuánto dura antes de auto-avanzar.
 */
export const slides = [
  {
    id: 'noticia',
    kind: 'hero',
    ms: 6000,
    kicker: 'Tenemos una noticia',
    headline: 'para ti',
  },
  {
    id: 'natura500',
    kind: 'text',
    ms: 4200,
    lines: ['Hace un tiempo, tu empresa decidió formar parte de', 'Natura500.'],
    emphasis: 'last',
  },
  {
    id: 'algo-mas-grande',
    kind: 'text',
    ms: 3800,
    lines: ['Y con eso, pasó a formar parte de', 'algo mucho más grande.'],
    emphasis: 'last',
  },
  {
    id: 'red',
    kind: 'stat',
    ms: 5000,
    value: 397,
    label: 'empresas verificadas',
    caption: 'de América Latina y el Caribe.',
  },
  {
    id: 'verdes-azules',
    kind: 'text',
    ms: 3000,
    lines: ['Empresas', 'verdes y azules.'],
    emphasis: 'last',
  },
  {
    id: 'tipos',
    kind: 'list',
    ms: 4600,
    items: ['Startups', 'PyMEs', 'Cooperativas', 'Empresas sociales'],
  },
  {
    id: 'construyendo',
    kind: 'text',
    ms: 5200,
    lines: [
      'Todas construyendo nuevas maneras de hacer empresa',
      'mientras generan valor para la naturaleza y sus territorios.',
    ],
  },
  {
    id: 'destacar',
    kind: 'text',
    ms: 4200,
    lines: ['Pero entre 397 historias…', 'algunas comenzaron a destacar.'],
    emphasis: 'last',
  },
  {
    id: 'por-que',
    kind: 'list',
    ms: 5400,
    intro: 'Destacaron',
    items: [
      'Por su potencial.',
      'Por lo que están construyendo.',
      'Por el impacto que pueden alcanzar.',
      'Y por hacia dónde podrían crecer.',
    ],
  },
  {
    id: 'expertos',
    kind: 'text',
    ms: 5600,
    lines: [
      'Por eso, un equipo de expertos y expertas de toda América Latina y el Caribe',
      'analizó esta primera generación de Natura500.',
    ],
  },
  {
    id: 'algo-que-contarte',
    kind: 'text',
    ms: 3000,
    lines: ['Y tenemos algo que contarte.'],
    emphasis: 'serif',
  },
  {
    id: 'seleccion',
    kind: 'reveal',
    ms: 7000,
    kicker: 'Tu empresa fue seleccionada como una de las',
    headline: '50 más prometedoras',
    sub: 'de Natura500',
  },
  {
    id: 'significado',
    kind: 'text',
    ms: 6200,
    lines: [
      'Este reconocimiento significa que formas parte de un grupo de empresas',
      'con un potencial especial para impulsar una nueva generación de negocios',
      'verdes y azules en América Latina y el Caribe.',
    ],
  },
  {
    id: 'sencillo',
    kind: 'text',
    ms: 4200,
    lines: ['Pero, sobre todo, significa algo más sencillo:', 'tu historia destacó.'],
    emphasis: 'last',
  },
  {
    id: 'compartir',
    kind: 'text',
    ms: 3000,
    lines: ['Y queremos que puedas compartirlo.'],
    emphasis: 'serif',
  },
]

/** Copy de la pantalla final de medalla. */
export const badge = {
  eyebrow: 'Comparte tu medalla',
  title: 'N500 Rooted',
  award: '50 más prometedoras',
  generation: 'Generación 2026',
  usage: ['Llévalo a tus redes.', 'A tu sitio web.', 'A tu próximo pitch.'],
  meaning: [
    'Porque este badge no solo dice que eres una de las 50.',
    'Dice que eres parte de la primera generación que está echando raíces.',
  ],
  closing: 'You are N500 Rooted.',
  welcome: 'Bienvenidos a las 50 más prometedoras de Natura500.',
}
