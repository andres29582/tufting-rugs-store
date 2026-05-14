import type { AdminReview, DesignReference, Order } from '../../types';
import { buildCustomization } from './customizationBuilder';
import { buildProduct } from './productBuilder';

const baseAdminReviews: AdminReview[] = [];
const baseDesignReferences: DesignReference[] = [
  {
    id: 'order-reference-1',
    kind: 'CUSTOMER_REFERENCE',
    url: 'https://example.com/reference.png',
    storageKey: null,
    mimeType: 'image/png',
    originalName: 'reference.png'
  }
];

const baseOrder: Order = {
  id: 'order-pending',
  publicCode: 'RUG-20260510-0001',
  productId: 'product-customizable',
  customizationId: 'customization-pending',
  customerName: 'Cliente Prueba',
  customerEmail: 'cliente@example.com',
  customerPhone: '+55 11 99999-0000',
  status: 'WAITING_ANALYSIS',
  estimatedPriceCents: null,
  finalPriceCents: null,
  depositAmountCents: null,
  depositPaid: false,
  productionPossible: true,
  notes: '',
  createdAt: '2026-05-10T03:00:00.000Z',
  product: null,
  customization: null,
  designReferences: baseDesignReferences,
  adminReviews: baseAdminReviews
};

export function buildOrder(overrides: Partial<Order> = {}): Order {
  const product = overrides.product === undefined ? buildProduct({
    id: baseOrder.productId,
    slug: 'alfombra-personalizable',
    type: 'FULL_CUSTOM',
    category: 'Personalizadas',
    isActive: true,
    customizable: true,
    isCustomizable: true
  }) : overrides.product;

  const customization = overrides.customization === undefined ? buildCustomization({
    id: baseOrder.customizationId,
    productId: product?.id ?? baseOrder.productId
  }) : overrides.customization;

  return {
    ...baseOrder,
    ...overrides,
    productId: overrides.productId ?? product?.id ?? baseOrder.productId,
    customizationId: overrides.customizationId ?? customization?.id ?? baseOrder.customizationId,
    product,
    customization,
    designReferences: cloneDesignReferences(
      overrides.designReferences ?? baseOrder.designReferences
    ),
    adminReviews: cloneAdminReviews(overrides.adminReviews ?? baseOrder.adminReviews)
  };
}

function cloneDesignReferences(references: DesignReference[]): DesignReference[] {
  return references.map((reference) => ({ ...reference }));
}

function cloneAdminReviews(reviews: AdminReview[]): AdminReview[] {
  return reviews.map((review) => ({ ...review }));
}
