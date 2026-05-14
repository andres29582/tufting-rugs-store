import type { OrderReviewPayload } from '../../types';

const baseOrderReviewPayload: OrderReviewPayload = {
  status: 'WAITING_CUSTOMER_APPROVAL',
  productionPossible: true,
  estimatedPriceCents: 18000,
  finalPriceCents: null,
  comment: 'Pedido viable para produccion.'
};

export function buildOrderReviewPayload(
  overrides: Partial<OrderReviewPayload> = {}
): OrderReviewPayload {
  return {
    ...baseOrderReviewPayload,
    ...overrides
  };
}
