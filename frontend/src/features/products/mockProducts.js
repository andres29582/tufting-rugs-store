export const productCategories = [
  'Todas',
  'Geométricas',
  'Minimalistas',
  'Orgánicas',
  'Decorativas',
  'Personalizadas'
];

export const mockProducts = [
  {
    id: '1',
    slug: 'ondas-abstractas',
    name: 'Ondas Abstractas',
    category: 'Decorativas',
    description:
      'Alfombra tufting hecha a mano con ondas libres, volumen suave y acabado premium para espacios con personalidad.',
    priceFrom: 150,
    size: '100 x 80 cm',
    image: '/rugs/ondas-abstractas.png',
    colors: ['#1d2b53', '#f97316', '#db5c91'],
    features: ['Hecha a mano', 'Material premium', 'Personalizable', 'Base antiderrapante'],
    customizable: true,
    motif: 'waves'
  },
  {
    id: '2',
    slug: 'geometria-moderna',
    name: 'Geometría Moderna',
    category: 'Geométricas',
    description:
      'Composición de bloques geométricos con contraste elegante, pensada para salas, estudios y rincones creativos.',
    priceFrom: 160,
    size: '100 x 80 cm',
    image: '/rugs/geometria-moderna.png',
    colors: ['#17324d', '#d8782e', '#f3dfbf'],
    features: ['Cortes definidos', 'Lana acrílica suave', 'Alta densidad', 'Serie limitada'],
    customizable: true,
    motif: 'geometric'
  },
  {
    id: '3',
    slug: 'terreno-natural',
    name: 'Terreno Natural',
    category: 'Orgánicas',
    description:
      'Formas inspiradas en mapas de tierra, fibras cálidas y una paleta serena para interiores naturales.',
    priceFrom: 140,
    size: '90 x 70 cm',
    image: '/rugs/terreno-natural.png',
    colors: ['#2f3f2f', '#b5884c', '#f4eadb'],
    features: ['Textura mullida', 'Diseño orgánico', 'Paleta natural', 'Borde reforzado'],
    customizable: true,
    motif: 'organic'
  },
  {
    id: '4',
    slug: 'circulos-organicos',
    name: 'Círculos Orgánicos',
    category: 'Orgánicas',
    description:
      'Pieza circular con capas tonales y ritmo suave, ideal para vestir espacios pequeños con una presencia escultórica.',
    priceFrom: 130,
    size: '90 x 90 cm',
    image: '/rugs/circulos-organicos.png',
    colors: ['#31482f', '#d9a05c', '#e9b2a4'],
    features: ['Formato circular', 'Acabado elevado', 'Colores a elección', 'Base firme'],
    customizable: true,
    motif: 'circles'
  },
  {
    id: '5',
    slug: 'arcos-y-lineas',
    name: 'Arcos y Líneas',
    category: 'Minimalistas',
    description:
      'Arcos gráficos sobre base clara, una alfombra sobria con gesto artístico para ambientes contemporáneos.',
    priceFrom: 150,
    size: '80 x 120 cm',
    image: '/rugs/arcos-y-lineas.png',
    colors: ['#111111', '#f2e7d5', '#9a4b35'],
    features: ['Minimalista', 'Fácil de combinar', 'Trazo gráfico', 'Hecha por encargo'],
    customizable: true,
    motif: 'arches'
  },
  {
    id: '6',
    slug: 'bruma-suave',
    name: 'Bruma Suave',
    category: 'Personalizadas',
    description:
      'Base abstracta de tonos suaves preparada para adaptar medidas, colores y formas al espacio del cliente.',
    priceFrom: 180,
    size: 'A medida',
    image: '/rugs/bruma-suave.png',
    colors: ['#6f8a9b', '#d8c7b1', '#b96f73'],
    features: ['100% personalizable', 'Moodboard incluido', 'Aprobación previa', 'Medidas flexibles'],
    customizable: true,
    motif: 'soft'
  }
];
