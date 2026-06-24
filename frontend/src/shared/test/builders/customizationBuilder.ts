import type { Customization, DesignReference } from '../../types';

const baseDesignReferences: DesignReference[] = [
  {
    id: 'reference-customer-1',
    kind: 'CUSTOMER_REFERENCE',
    url: 'https://example.com/reference.png',
    storageKey: null,
    mimeType: 'image/png',
    originalName: 'reference.png',
  },
];

const baseCustomization: Customization = {
  id: 'customization-pending',
  productId: 'product-customizable',
  customerName: 'Cliente Prueba',
  customerEmail: 'cliente@example.com',
  customerPhone: '+55 11 99999-0000',
  description: 'Quiero una alfombra personalizada para sala.',
  preferredColors: ['#1d2b53', '#f97316', '#db5c91'],
  sizeCategory: 'MEDIUM',
  sizeLabel: '100 x 80 cm',
  format: 'ORGANIC',
  designReferences: baseDesignReferences,
  createdAt: '2026-05-10T03:00:00.000Z',
};

export function buildCustomization(overrides: Partial<Customization> = {}): Customization {
  return {
    ...baseCustomization,
    ...overrides,
    preferredColors: [...(overrides.preferredColors ?? baseCustomization.preferredColors)],
    designReferences: cloneDesignReferences(
      overrides.designReferences ?? baseCustomization.designReferences
    ),
  };
}

function cloneDesignReferences(references: DesignReference[]): DesignReference[] {
  return references.map((reference) => ({ ...reference }));
}
