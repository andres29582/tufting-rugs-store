import type { AdminReview, ApiOrder, Order } from '../../../shared/types';
import { mapCustomizationFromApi } from '../../customizations/model/customizationsMapper';
import { mapProductFromApi, type ProductMapperOptions } from '../../products/model/productsMapper';

export function mapOrderFromApi(
  order: ApiOrder,
  options: ProductMapperOptions = {}
): Order {
  return {
    id: order.id,
    publicCode: order.publicCode || order.id,
    productId: order.productId || '',
    customizationId: order.customizationId || '',
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || '',
    status: order.status,
    estimatedPriceCents: order.estimatedPriceCents ?? null,
    finalPriceCents: order.finalPriceCents ?? null,
    depositAmountCents: order.depositAmountCents ?? null,
    depositPaid: order.depositPaid ?? false,
    productionPossible: order.productionPossible ?? true,
    notes: order.notes || '',
    createdAt: order.createdAt || null,
    product: order.product ? mapProductFromApi(order.product, options) : null,
    customization: order.customization ? mapCustomizationFromApi(order.customization) : null,
    designReferences: Array.isArray(order.designReferences) ? order.designReferences : [],
    adminReviews: normalizeReviews(order.adminReviews)
  };
}

export function mapOrdersFromApi(
  orders: ApiOrder[] | unknown,
  options: ProductMapperOptions = {}
): Order[] {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders.map((order) => mapOrderFromApi(order as ApiOrder, options));
}

function normalizeReviews(reviews: ApiOrder['adminReviews']): AdminReview[] {
  if (!Array.isArray(reviews)) {
    return [];
  }

  return reviews.map((review) => ({
    id: review.id,
    status: review.status ?? null,
    productionPossible: review.productionPossible ?? null,
    estimatedPriceCents: review.estimatedPriceCents ?? null,
    finalPriceCents: review.finalPriceCents ?? null,
    depositAmountCents: review.depositAmountCents ?? null,
    comment: review.comment || '',
    createdAt: review.createdAt || null
  }));
}
