import type { AdminProductPayload } from '../../types';

const baseAdminProductPayload: AdminProductPayload = {
  name: 'Alfombra admin',
  slug: 'alfombra-admin',
  description: 'Producto valido para pruebas de creacion y edicion admin.',
  type: 'READY_MADE',
  basePriceCents: 15000,
  sizeCategory: 'MEDIUM',
  sizeLabel: '100 x 80 cm',
  format: 'RECTANGULAR',
  category: 'Decorativas',
  imageUrl: '/uploads/product-images/alfombra-admin.png',
  colors: ['#1d2b53', '#f97316', '#db5c91'],
  features: ['Hecha a mano', 'Material premium', 'Base antiderrapante'],
  material: 'Lana acrilica',
  productionTime: '12 a 18 dias',
  isCustomizable: true,
  isFeatured: false,
  isActive: true,
};

export function buildAdminProductPayload(
  overrides: Partial<AdminProductPayload> = {}
): AdminProductPayload {
  return {
    ...baseAdminProductPayload,
    ...overrides,
    colors: [...(overrides.colors ?? baseAdminProductPayload.colors)],
    features: [...(overrides.features ?? baseAdminProductPayload.features)],
  };
}
