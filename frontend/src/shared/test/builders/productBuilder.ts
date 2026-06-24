import type { ColorPalette, Product } from '../../types';

const baseProduct: Product = {
  id: 'product-published',
  slug: 'alfombra-publicada',
  type: 'READY_MADE',
  name: 'Alfombra publicada',
  category: 'Decorativas',
  description: 'Alfombra tufting valida para pruebas de catalogo.',
  priceFrom: 150,
  basePriceCents: 15000,
  size: '100 x 80 cm',
  sizeCategory: 'MEDIUM',
  format: 'RECTANGULAR',
  image: '/rugs/alfombra-publicada.png',
  imageUrl: '/rugs/alfombra-publicada.png',
  colors: ['#1d2b53', '#f97316', '#db5c91'],
  features: ['Hecha a mano', 'Material premium', 'Base antiderrapante'],
  material: 'Lana acrilica',
  productionTime: '12 a 18 dias',
  customizable: true,
  isCustomizable: true,
  isFeatured: true,
  isActive: true,
  motif: 'geometric',
};

export function buildProduct(overrides: Partial<Product> = {}): Product {
  const colors = cloneColorPalette(overrides.colors ?? baseProduct.colors);
  const features = [...(overrides.features ?? baseProduct.features)];

  return {
    ...baseProduct,
    ...overrides,
    colors,
    features,
  };
}

function cloneColorPalette(colors: ColorPalette): ColorPalette {
  const [first, second, third, ...rest] = colors;

  return [first, second, third, ...rest];
}
