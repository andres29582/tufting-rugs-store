import type { Language } from '../../../shared/i18n';
import type { Product } from '../../../shared/types';

type LocalizedProductCopy = {
  name: string;
  description: string;
};

const productCopyBySlug: Record<string, Record<Language, LocalizedProductCopy>> = {
  'bola-ocho': {
    es: {
      name: 'Bola Ocho',
      description:
        'Alfombra tufting circular inspirada en la bola ocho, con textura alta y contraste grafico para espacios con actitud.',
    },
    pt: {
      name: 'Bola Oito',
      description:
        'Tapete tufting circular inspirado na bola oito, com textura alta e contraste grafico para espacos com atitude.',
    },
  },
  'ondas-abstractas': {
    es: {
      name: 'Ondas Abstractas',
      description:
        'Alfombra tufting hecha a mano con ondas libres, volumen suave y acabado premium para espacios con personalidad.',
    },
    pt: {
      name: 'Ondas Abstratas',
      description:
        'Tapete tufting feito a mao com ondas livres, volume macio e acabamento premium para espacos com personalidade.',
    },
  },
  'geometria-moderna': {
    es: {
      name: 'Geometria Moderna',
      description:
        'Composicion de bloques geometricos con contraste elegante, pensada para salas, estudios y rincones creativos.',
    },
    pt: {
      name: 'Geometria Moderna',
      description:
        'Composicao de blocos geometricos com contraste elegante, pensada para salas, estudios e cantos criativos.',
    },
  },
  'terreno-natural': {
    es: {
      name: 'Terreno Natural',
      description:
        'Formas inspiradas en mapas de tierra, fibras calidas y una paleta serena para interiores naturales.',
    },
    pt: {
      name: 'Terreno Natural',
      description:
        'Formas inspiradas em mapas de terra, fibras acolhedoras e uma paleta serena para interiores naturais.',
    },
  },
  'circulos-organicos': {
    es: {
      name: 'Circulos Organicos',
      description:
        'Pieza circular con capas tonales y ritmo suave, ideal para vestir espacios pequenos con presencia escultorica.',
    },
    pt: {
      name: 'Circulos Organicos',
      description:
        'Peca circular com camadas tonais e ritmo suave, ideal para vestir espacos pequenos com presenca escultorica.',
    },
  },
  'arcos-y-lineas': {
    es: {
      name: 'Arcos y Lineas',
      description:
        'Arcos graficos sobre base clara, una alfombra sobria con gesto artistico para ambientes contemporaneos.',
    },
    pt: {
      name: 'Arcos e Linhas',
      description:
        'Arcos graficos sobre base clara, um tapete sobrio com gesto artistico para ambientes contemporaneos.',
    },
  },
  'bruma-suave': {
    es: {
      name: 'Bruma Suave',
      description:
        'Base abstracta de tonos suaves preparada para adaptar medidas, colores y formas al espacio del cliente.',
    },
    pt: {
      name: 'Bruma Suave',
      description:
        'Base abstrata de tons suaves pronta para adaptar medidas, cores e formas ao espaco do cliente.',
    },
  },
};

const categoryLabels: Record<string, Record<Language, string>> = {
  todas: { es: 'Todas', pt: 'Todos' },
  geometricas: { es: 'Geometricas', pt: 'Geometricos' },
  minimalistas: { es: 'Minimalistas', pt: 'Minimalistas' },
  organicas: { es: 'Organicas', pt: 'Organicos' },
  decorativas: { es: 'Decorativas', pt: 'Decorativos' },
  personalizadas: { es: 'Personalizadas', pt: 'Personalizados' },
};

const productNameLabels: Record<string, Record<Language, string>> = {
  'alfombra demo rectangular': { es: 'Alfombra demo rectangular', pt: 'Tapete demo retangular' },
  'alfombra 100% personalizada': {
    es: 'Alfombra 100% Personalizada',
    pt: 'Tapete 100% Personalizado',
  },
};

const productDescriptionLabels: Record<string, Record<Language, string>> = {
  'producto demo creado desde docs/api-examples.http': {
    es: 'Producto demo creado desde docs/api-examples.http',
    pt: 'Produto demo criado em docs/api-examples.http',
  },
  'entrada al flujo de cotizacion para alfombras personalizadas.': {
    es: 'Entrada al flujo de cotizacion para alfombras personalizadas.',
    pt: 'Entrada no fluxo de cotacao para tapetes personalizados.',
  },
  'alfombra tufting hecha a mano con acabado premium.': {
    es: 'Alfombra tufting hecha a mano con acabado premium.',
    pt: 'Tapete tufting feito a mao com acabamento premium.',
  },
};

const featureLabels: Record<string, Record<Language, string>> = {
  'hecha a mano': { es: 'Hecha a mano', pt: 'Feito a mao' },
  'material premium': { es: 'Material premium', pt: 'Material premium' },
  personalizable: { es: 'Personalizable', pt: 'Personalizavel' },
  'base antiderrapante': { es: 'Base antiderrapante', pt: 'Base antiderrapante' },
  'cortes definidos': { es: 'Cortes definidos', pt: 'Cortes definidos' },
  'lana acrilica suave': { es: 'Lana acrilica suave', pt: 'La acrilica macia' },
  'alta densidad': { es: 'Alta densidad', pt: 'Alta densidade' },
  'serie limitada': { es: 'Serie limitada', pt: 'Serie limitada' },
  'textura mullida': { es: 'Textura mullida', pt: 'Textura macia' },
  'diseno organico': { es: 'Diseno organico', pt: 'Design organico' },
  'paleta natural': { es: 'Paleta natural', pt: 'Paleta natural' },
  'borde reforzado': { es: 'Borde reforzado', pt: 'Borda reforcada' },
  'formato circular': { es: 'Formato circular', pt: 'Formato circular' },
  'acabado elevado': { es: 'Acabado elevado', pt: 'Acabamento elevado' },
  'colores a eleccion': { es: 'Colores a eleccion', pt: 'Cores a escolha' },
  'base firme': { es: 'Base firme', pt: 'Base firme' },
  minimalista: { es: 'Minimalista', pt: 'Minimalista' },
  'facil de combinar': { es: 'Facil de combinar', pt: 'Facil de combinar' },
  'trazo grafico': { es: 'Trazo grafico', pt: 'Traco grafico' },
  'hecha por encargo': { es: 'Hecha por encargo', pt: 'Feito sob encomenda' },
  '100% personalizable': { es: '100% personalizable', pt: '100% personalizavel' },
  'moodboard incluido': { es: 'Moodboard incluido', pt: 'Moodboard incluido' },
  'aprobacion previa': { es: 'Aprobacion previa', pt: 'Aprovacao previa' },
  'medidas flexibles': { es: 'Medidas flexibles', pt: 'Medidas flexiveis' },
};

const sizeLabels: Record<string, Record<Language, string>> = {
  'a medida': { es: 'A medida', pt: 'Sob medida' },
  'sob orcamento': { es: 'A cotizar', pt: 'Sob orcamento' },
};

const materialLabels: Record<string, Record<Language, string>> = {
  'lana acrilica': { es: 'Lana acrilica', pt: 'La acrilica' },
};

const productionLabels: Record<string, Record<Language, string>> = {
  '12 a 18 dias': { es: '12 a 18 dias', pt: '12 a 18 dias' },
  'bajo analisis': { es: 'Bajo analisis', pt: 'Sob analise' },
};

export function localizeProduct(product: Product, language: Language): Product {
  const copy = productCopyBySlug[product.slug]?.[language];

  return {
    ...product,
    name: copy?.name || localizeProductName(product.name, language),
    category: localizeCategory(product.category, language),
    description: copy?.description || localizeProductDescription(product.description, language),
    size: localizeSize(product.size, language),
    features: product.features.map((feature) => localizeFeature(feature, language)),
    material: localizeMaterial(product.material, language),
    productionTime: localizeProductionTime(product.productionTime, language),
  };
}

export function localizeProductName(name: string, language: Language): string {
  return productNameLabels[toLookupKey(name)]?.[language] || normalizeVisibleText(name);
}

export function localizeProductDescription(description: string, language: Language): string {
  return (
    productDescriptionLabels[toLookupKey(description)]?.[language] ||
    normalizeVisibleText(description)
  );
}

export function localizeCategory(category: string, language: Language): string {
  return categoryLabels[toLookupKey(category)]?.[language] || normalizeVisibleText(category);
}

export function localizeFeature(feature: string, language: Language): string {
  return featureLabels[toLookupKey(feature)]?.[language] || normalizeVisibleText(feature);
}

export function localizeSize(size: string, language: Language): string {
  return sizeLabels[toLookupKey(size)]?.[language] || normalizeVisibleText(size);
}

export function localizeMaterial(material: string, language: Language): string {
  return materialLabels[toLookupKey(material)]?.[language] || normalizeVisibleText(material);
}

export function localizeProductionTime(productionTime: string, language: Language): string {
  return (
    productionLabels[toLookupKey(productionTime)]?.[language] ||
    normalizeVisibleText(productionTime)
  );
}

function normalizeVisibleText(value: string): string {
  return repairMojibake(value).replaceAll(String.fromCharCode(183), '-');
}

function repairMojibake(value: string): string {
  let current = value;

  for (let index = 0; index < 2; index += 1) {
    const bytes = Array.from(current, (character) => character.charCodeAt(0));

    if (bytes.some((byte) => byte > 255)) {
      return current;
    }

    const decoded = new TextDecoder('utf-8').decode(new Uint8Array(bytes));

    if (!decoded || decoded === current || decoded.includes(String.fromCharCode(65533))) {
      return current;
    }

    current = decoded;
  }

  return current;
}

function toLookupKey(value: string): string {
  return normalizeVisibleText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
