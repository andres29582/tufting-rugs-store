import { buildProduct } from '../builders';

export const publishedProductFixture = buildProduct();

export const unpublishedProductFixture = buildProduct({
  id: 'product-unpublished',
  slug: 'alfombra-no-publicada',
  name: 'Alfombra no publicada',
  isActive: false,
  isFeatured: false,
});

export const customizableProductFixture = buildProduct({
  id: 'product-customizable',
  slug: 'alfombra-personalizable',
  type: 'FULL_CUSTOM',
  name: 'Alfombra personalizable',
  category: 'Personalizadas',
  description: 'Producto base para solicitudes personalizadas.',
  priceFrom: 180,
  basePriceCents: 18000,
  size: 'A medida',
  sizeCategory: 'CUSTOM',
  format: 'CUSTOM',
  image: '/rugs/alfombra-personalizable.png',
  imageUrl: '/rugs/alfombra-personalizable.png',
  colors: ['#6f8a9b', '#d8c7b1', '#b96f73'],
  features: ['100% personalizable', 'Aprobacion previa', 'Medidas flexibles'],
  productionTime: 'Bajo analisis',
  customizable: true,
  isCustomizable: true,
  isFeatured: true,
  isActive: true,
  motif: 'soft',
});
