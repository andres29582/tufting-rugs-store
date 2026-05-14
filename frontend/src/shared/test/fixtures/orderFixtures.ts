import { buildOrder } from '../builders';
import { pendingCustomizationFixture } from './customizationFixtures';
import { customizableProductFixture } from './productFixtures';

export const pendingOrderFixture = buildOrder({
  id: 'order-pending',
  publicCode: 'RUG-20260510-0001',
  productId: customizableProductFixture.id,
  customizationId: pendingCustomizationFixture.id,
  status: 'WAITING_ANALYSIS',
  estimatedPriceCents: null,
  finalPriceCents: null,
  depositAmountCents: null,
  depositPaid: false,
  productionPossible: true,
  product: customizableProductFixture,
  customization: pendingCustomizationFixture,
  adminReviews: []
});

export const reviewedApprovedOrderFixture = buildOrder({
  id: 'order-approved',
  publicCode: 'RUG-20260510-0002',
  productId: customizableProductFixture.id,
  customizationId: pendingCustomizationFixture.id,
  status: 'APPROVED',
  estimatedPriceCents: 18000,
  finalPriceCents: 20000,
  depositAmountCents: 10000,
  depositPaid: false,
  productionPossible: true,
  product: customizableProductFixture,
  customization: pendingCustomizationFixture,
  adminReviews: [
    {
      id: 'review-approved',
      status: 'APPROVED',
      productionPossible: true,
      estimatedPriceCents: 18000,
      finalPriceCents: 20000,
      depositAmountCents: 10000,
      comment: 'Pedido aprobado para produccion.',
      createdAt: '2026-05-10T04:00:00.000Z'
    }
  ]
});
