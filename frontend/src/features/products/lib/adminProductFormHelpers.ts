import type {
  AdminProductPayload,
  Product,
  ProductType,
  RugFormat,
  SizeCategory
} from '../../../shared/types';

export type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  basePrice: string;
  category: string;
  sizeCategory: SizeCategory;
  sizeLabel: string;
  format: RugFormat;
  imageUrl: string;
  colorsText: string;
  featuresText: string;
  material: string;
  productionTime: string;
  isCustomizable: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

export function createInitialProductForm(): ProductFormState {
  return {
    name: '',
    slug: '',
    description: '',
    type: 'READY_MADE',
    basePrice: '',
    category: 'Decorativas',
    sizeCategory: 'MEDIUM',
    sizeLabel: '100 x 80 cm',
    format: 'RECTANGULAR',
    imageUrl: '',
    colorsText: '#1d2b53\n#f97316\n#db5c91',
    featuresText: 'Hecha a mano\nMaterial premium\nBase antiderrapante',
    material: 'Lana acrilica',
    productionTime: '12 a 18 dias',
    isCustomizable: true,
    isFeatured: false,
    isActive: false
  };
}

export function mapProductToAdminForm(product: Product): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    type: product.type || 'READY_MADE',
    basePrice: String(product.priceFrom),
    category: product.category,
    sizeCategory: product.sizeCategory,
    sizeLabel: product.size,
    format: product.format,
    imageUrl: product.imageUrl,
    colorsText: product.colors.join('\n'),
    featuresText: product.features.join('\n'),
    material: product.material,
    productionTime: product.productionTime,
    isCustomizable: product.isCustomizable,
    isFeatured: product.isFeatured,
    isActive: product.isActive
  };
}

export function mapAdminProductFormToPayload(form: ProductFormState): AdminProductPayload {
  const basePrice = Number(String(form.basePrice).replace(',', '.'));

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error('Ingresa un precio base valido.');
  }

  return {
    name: form.name.trim(),
    slug: slugifyAdminProduct(form.slug || form.name),
    description: optionalText(form.description),
    type: form.type,
    basePriceCents: Math.round(basePrice * 100),
    sizeCategory: form.sizeCategory,
    sizeLabel: form.sizeLabel.trim(),
    format: form.format,
    category: optionalText(form.category),
    imageUrl: optionalText(form.imageUrl),
    colors: splitAdminProductList(form.colorsText),
    features: splitAdminProductList(form.featuresText),
    material: optionalText(form.material),
    productionTime: optionalText(form.productionTime),
    isCustomizable: form.isCustomizable,
    isFeatured: form.isFeatured,
    isActive: form.isActive
  };
}

export function slugifyAdminProduct(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function splitAdminProductList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
