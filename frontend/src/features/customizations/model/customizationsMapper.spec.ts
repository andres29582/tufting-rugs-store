import { describe, expect, it } from 'vitest';
import type { ApiCustomization, CustomizationDraft } from '../../../shared/types';
import {
  mapAdminCustomizationFromApi,
  mapCustomizationDraftToApi,
  mapCustomizationFromApi,
} from './customizationsMapper';

describe('customizationsMapper', () => {
  it('maps customization drafts to the backend payload shape', () => {
    const draft: CustomizationDraft = {
      productId: 'product-custom',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      customerPhone: '',
      description: 'Uma ideia personalizada',
      preferredColors: ['#111111', '#222222'],
      sizeCategory: 'CUSTOM',
      sizeLabel: '',
      format: 'ORGANIC',
      referenceUrl: 'https://example.com/reference.png',
      notes: 'Internal note ignored by payload',
    };

    expect(mapCustomizationDraftToApi(draft)).toEqual({
      productId: 'product-custom',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      customerPhone: null,
      description: 'Uma ideia personalizada',
      preferredColors: ['#111111', '#222222'],
      sizeCategory: 'CUSTOM',
      sizeLabel: null,
      format: 'ORGANIC',
      designReferences: [
        {
          kind: 'CUSTOMER_REFERENCE',
          url: 'https://example.com/reference.png',
          originalName: 'Referencia visual del cliente',
        },
      ],
    });
  });

  it('maps API customizations with safe defaults', () => {
    const customization = mapCustomizationFromApi({
      id: 'customization-1',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      preferredColors: null,
      designReferences: null,
    });

    expect(customization).toMatchObject({
      id: 'customization-1',
      productId: '',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      customerPhone: '',
      description: '',
      preferredColors: [],
      sizeCategory: 'CUSTOM',
      sizeLabel: 'A medida',
      format: 'CUSTOM',
      designReferences: [],
      createdAt: null,
    });
  });

  it('maps admin customization product and order summary', () => {
    const apiCustomization: ApiCustomization = {
      id: 'customization-admin',
      productId: 'product-1',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      product: {
        id: 'product-1',
        name: 'Produto',
      },
      order: {
        id: 'order-1',
        publicCode: null,
        customerName: 'Cliente',
        customerEmail: 'cliente@example.com',
        status: 'WAITING_ANALYSIS',
        createdAt: '2026-05-10T03:00:00.000Z',
      },
    };

    const customization = mapAdminCustomizationFromApi(apiCustomization);

    expect(customization.product?.id).toBe('product-1');
    expect(customization.order).toEqual({
      id: 'order-1',
      publicCode: 'order-1',
      status: 'WAITING_ANALYSIS',
      createdAt: '2026-05-10T03:00:00.000Z',
    });
  });

  it('passes product asset resolution options to nested products', () => {
    const customization = mapAdminCustomizationFromApi(
      {
        id: 'customization-admin',
        customerName: 'Cliente',
        customerEmail: 'cliente@example.com',
        product: {
          id: 'product-1',
          name: 'Produto',
          imageUrl: '/uploads/product.png',
        },
      },
      {
        resolveAssetUrl: (url) => 'https://api.example.com' + url,
      }
    );

    expect(customization.product?.imageUrl).toBe('https://api.example.com/uploads/product.png');
  });
});
