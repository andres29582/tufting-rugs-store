import type { ApiProduct, ColorPalette, Product, RugMotif } from '../../shared/types';

export type ProductMapperOptions = {
  resolveAssetUrl?: (url: string) => string;
};

const fallbackColors: ColorPalette = ['#1d2b53', '#f97316', '#db5c91'];
const allowedMotifs = new Set<RugMotif>([
  'waves',
  'geometric',
  'organic',
  'circles',
  'arches',
  'soft'
]);

export function mapProductFromApi(
  product: ApiProduct,
  options: ProductMapperOptions = {}
): Product {
  const basePriceCents = product.basePriceCents || product.priceFromCents || 0;
  const imageUrl = normalizeProductImageUrl(product.imageUrl || product.image || '', options);
  const isCustomizable = product.isCustomizable ?? product.customizable !== false;

  return {
    id: product.id,
    slug: product.slug || product.id,
    type: product.type || null,
    name: product.name,
    category: product.category || getCategoryFromType(product.type || null),
    description: product.description || 'Alfombra tufting hecha a mano con acabado premium.',
    priceFrom: centsToDisplayPrice(basePriceCents),
    basePriceCents,
    size: product.sizeLabel || product.size || 'A medida',
    sizeCategory: product.sizeCategory || 'CUSTOM',
    format: product.format || 'CUSTOM',
    image: imageUrl,
    imageUrl,
    colors: normalizeColors(product.colors),
    features: normalizeFeatures(product),
    material: product.material || '',
    productionTime: product.productionTime || '',
    customizable: isCustomizable,
    isCustomizable,
    isFeatured: product.isFeatured ?? false,
    isActive: product.isActive ?? true,
    motif: normalizeMotif(product.motif)
  };
}

export function mapProductsFromApi(
  products: ApiProduct[] | unknown,
  options: ProductMapperOptions = {}
): Product[] {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((product) => mapProductFromApi(product as ApiProduct, options));
}

export function normalizeProductImageUrl(
  url: string | null | undefined,
  options: ProductMapperOptions = {}
): string {
  const value = String(url || '').trim();

  return options.resolveAssetUrl ? options.resolveAssetUrl(value) : value;
}

function centsToDisplayPrice(value: number): number {
  return Math.round(Number(value) / 100);
}

function getCategoryFromType(type: string | null): string {
  if (type === 'FULL_CUSTOM') {
    return 'Personalizadas';
  }

  return 'Decorativas';
}

function normalizeColors(colors: string[] | null | undefined): ColorPalette {
  if (!Array.isArray(colors) || colors.length < 3) {
    return fallbackColors;
  }

  const first = String(colors[0] || '').trim();
  const second = String(colors[1] || '').trim();
  const third = String(colors[2] || '').trim();

  if (!first || !second || !third) {
    return fallbackColors;
  }

  return [first, second, third, ...colors.slice(3).filter(Boolean)];
}

function normalizeFeatures(product: ApiProduct): string[] {
  if (Array.isArray(product.features) && product.features.length) {
    return product.features;
  }

  if (product.type === 'FULL_CUSTOM') {
    return ['100% personalizable', 'Aprobación previa', 'Medidas flexibles'];
  }

  return ['Hecha a mano', 'Material premium', 'Base antiderrapante'];
}

function normalizeMotif(motif: string | null | undefined): RugMotif {
  return motif && allowedMotifs.has(motif as RugMotif) ? (motif as RugMotif) : 'waves';
}
