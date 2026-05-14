import { describe, expect, it } from 'vitest';
import {
  buildAdminProductPayload,
  buildCustomization,
  buildOrder,
  buildOrderReviewPayload,
  buildProduct
} from './index';

describe('test data builders', () => {
  it('builds a valid Product with overrides', () => {
    const product = buildProduct({
      id: 'product-overridden',
      isActive: false,
      colors: ['#000000', '#111111', '#222222']
    });

    expect(product).toMatchObject({
      id: 'product-overridden',
      isActive: false,
      slug: 'alfombra-publicada'
    });
    expect(product.colors).toEqual(['#000000', '#111111', '#222222']);
  });

  it('builds a valid Customization with cloned collection fields', () => {
    const customization = buildCustomization({
      id: 'customization-overridden',
      preferredColors: ['#111111']
    });

    expect(customization).toMatchObject({
      id: 'customization-overridden',
      productId: 'product-customizable',
      customerEmail: 'cliente@example.com'
    });
    expect(customization.preferredColors).toEqual(['#111111']);
    expect(customization.designReferences).toHaveLength(1);
  });

  it('builds a valid Order and keeps product/customization relationships coherent', () => {
    const order = buildOrder({
      id: 'order-overridden',
      status: 'APPROVED'
    });

    expect(order).toMatchObject({
      id: 'order-overridden',
      status: 'APPROVED',
      productId: 'product-customizable',
      customizationId: 'customization-pending'
    });
    expect(order.product?.id).toBe(order.productId);
    expect(order.customization?.id).toBe(order.customizationId);
  });

  it('builds a valid AdminProductPayload', () => {
    const payload = buildAdminProductPayload({
      name: 'Producto test',
      basePriceCents: 22000
    });

    expect(payload).toMatchObject({
      name: 'Producto test',
      slug: 'alfombra-admin',
      basePriceCents: 22000,
      type: 'READY_MADE'
    });
    expect(payload.colors).toHaveLength(3);
    expect(payload.features.length).toBeGreaterThan(0);
  });

  it('builds a valid OrderReviewPayload', () => {
    const payload = buildOrderReviewPayload({
      status: 'CANCELED',
      productionPossible: false,
      finalPriceCents: 0
    });

    expect(payload).toEqual({
      status: 'CANCELED',
      productionPossible: false,
      estimatedPriceCents: 18000,
      finalPriceCents: 0,
      comment: 'Pedido viable para produccion.'
    });
  });
});
