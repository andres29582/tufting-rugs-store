import { describe, expect, it } from 'vitest';
import type { ApiOrder } from '../../../shared/types';
import { mapOrderFromApi, mapOrdersFromApi } from './ordersMapper';

describe('ordersMapper', () => {
  it('maps API orders with nested product, customization and review history', () => {
    const apiOrder: ApiOrder = {
      id: 'order-1',
      publicCode: null,
      productId: 'product-1',
      customizationId: 'customization-1',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      customerPhone: null,
      status: 'WAITING_CUSTOMER_APPROVAL',
      estimatedPriceCents: 18000,
      finalPriceCents: null,
      depositAmountCents: 9000,
      depositPaid: false,
      productionPossible: true,
      notes: null,
      createdAt: '2026-05-10T03:00:00.000Z',
      product: {
        id: 'product-1',
        name: 'Produto',
      },
      customization: {
        id: 'customization-1',
        productId: 'product-1',
        customerName: 'Cliente',
        customerEmail: 'cliente@example.com',
      },
      designReferences: null,
      adminReviews: [
        {
          id: 'review-1',
          status: 'WAITING_CUSTOMER_APPROVAL',
          productionPossible: true,
          estimatedPriceCents: 18000,
          finalPriceCents: null,
          depositAmountCents: 9000,
          comment: null,
          createdAt: '2026-05-10T04:00:00.000Z',
        },
      ],
    };

    const order = mapOrderFromApi(apiOrder);

    expect(order).toMatchObject({
      id: 'order-1',
      publicCode: 'order-1',
      productId: 'product-1',
      customizationId: 'customization-1',
      customerPhone: '',
      status: 'WAITING_CUSTOMER_APPROVAL',
      notes: '',
      designReferences: [],
    });
    expect(order.product?.id).toBe('product-1');
    expect(order.customization?.id).toBe('customization-1');
    expect(order.adminReviews).toEqual([
      {
        id: 'review-1',
        status: 'WAITING_CUSTOMER_APPROVAL',
        productionPossible: true,
        estimatedPriceCents: 18000,
        finalPriceCents: null,
        depositAmountCents: 9000,
        comment: '',
        createdAt: '2026-05-10T04:00:00.000Z',
      },
    ]);
  });

  it('maps arrays and ignores non-array inputs', () => {
    expect(
      mapOrdersFromApi([
        {
          id: 'order-1',
          customerName: 'A',
          customerEmail: 'a@example.com',
          status: 'WAITING_ANALYSIS',
        },
      ])
    ).toHaveLength(1);
    expect(mapOrdersFromApi(undefined)).toEqual([]);
  });

  it('passes product asset resolution options to nested products', () => {
    const order = mapOrderFromApi(
      {
        id: 'order-asset',
        customerName: 'Cliente',
        customerEmail: 'cliente@example.com',
        status: 'WAITING_ANALYSIS',
        product: {
          id: 'product-asset',
          name: 'Produto',
          imageUrl: '/uploads/product.png',
        },
      },
      {
        resolveAssetUrl: (url) => 'https://api.example.com' + url,
      }
    );

    expect(order.product?.imageUrl).toBe('https://api.example.com/uploads/product.png');
  });
});
