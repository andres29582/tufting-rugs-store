import { buildCustomization } from '../builders';
import { customizableProductFixture } from './productFixtures';

export const pendingCustomizationFixture = buildCustomization({
  id: 'customization-pending',
  productId: customizableProductFixture.id,
  customerName: 'Cliente Prueba',
  customerEmail: 'cliente@example.com',
  customerPhone: '+55 11 99999-0000',
  description: 'Quiero una alfombra personalizada para sala.',
  preferredColors: customizableProductFixture.colors,
  sizeCategory: 'CUSTOM',
  sizeLabel: 'A medida',
  format: 'CUSTOM',
  createdAt: '2026-05-10T03:00:00.000Z',
});
