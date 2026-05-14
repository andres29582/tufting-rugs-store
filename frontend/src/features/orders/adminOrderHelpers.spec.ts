import { describe, expect, it } from 'vitest';
import { buildCustomization, buildOrder, buildProduct } from '../../shared/test/builders';
import {
  buildAdminOrderReviewPayload,
  centsToInput,
  createOrderReviewForm,
  formatAdminDate,
  formatOptionalOrderCents,
  getCustomizationBriefDetails,
  getCustomizationBriefPreview,
  getOrderProductName,
  getOrderStatusLabel,
  parseOptionalMoney
} from './adminOrderHelpers';

describe('adminOrderHelpers', () => {
  it('creates review form state from an order', () => {
    const order = buildOrder({
      status: 'WAITING_DEPOSIT',
      productionPossible: false,
      estimatedPriceCents: 18000,
      finalPriceCents: 20000
    });

    expect(createOrderReviewForm(order)).toEqual({
      status: 'WAITING_DEPOSIT',
      productionPossible: false,
      estimatedPrice: '180',
      finalPrice: '200',
      comment: ''
    });
  });

  it('builds review payloads and omits empty money fields', () => {
    const payload = buildAdminOrderReviewPayload({
      status: 'APPROVED',
      productionPossible: true,
      estimatedPrice: '180,50',
      finalPrice: '',
      comment: '  Revisado  '
    });

    expect(payload).toEqual({
      status: 'APPROVED',
      productionPossible: true,
      comment: 'Revisado',
      estimatedPriceCents: 18050
    });
  });

  it('parses money values and rejects invalid values', () => {
    expect(parseOptionalMoney('')).toBeUndefined();
    expect(parseOptionalMoney('12,34')).toBe(1234);
    expect(centsToInput(null)).toBe('');
    expect(centsToInput(1234)).toBe('12');
    expect(() => parseOptionalMoney('-1')).toThrow('Ingresa un precio valido.');
  });

  it('formats optional cents and admin dates', () => {
    expect(formatOptionalOrderCents(null)).toBe('Sin valor');
    expect(formatOptionalOrderCents(18000)).toContain('180');
    expect(formatAdminDate(null)).toBe('Sin fecha');
  });

  it('resolves product names and status labels', () => {
    expect(getOrderProductName(buildOrder({ product: buildProduct({ name: 'Produto' }) }))).toBe('Produto');
    expect(
      getOrderProductName(
        buildOrder({
          product: null,
          customization: buildCustomization({ productId: 'custom-product-id' })
        })
      )
    ).toBe('custom-product-id');
    expect(getOrderStatusLabel('WAITING_CUSTOMER_APPROVAL')).toBe('Aprobacion cliente');
  });

  it('extracts a compact preview and fields from guided customization briefs', () => {
    const customization = buildCustomization({
      description: [
        'Brief guiado de alfombra personalizada',
        '',
        'Producto base',
        'Nombre: Base premium',
        '',
        'Decisiones del diseno',
        'Intencion: Elegante',
        'Uso: Setup',
        'Estilo: Gamer neon',
        'Colores a evitar: Blanco'
      ].join('\n')
    });
    const details = getCustomizationBriefDetails(customization);

    expect(getCustomizationBriefPreview(customization)).toBe(
      'Intencion: Elegante - Uso: Setup - Estilo: Gamer neon'
    );
    expect(details).toMatchObject({
      isGuided: true,
      productName: 'Base premium',
      intention: 'Elegante',
      placement: 'Setup',
      visualStyle: 'Gamer neon',
      colorsAvoid: 'Blanco'
    });
    expect(getCustomizationBriefPreview(buildCustomization({ description: '' }))).toBe('Sin brief');
  });

  it('recognizes transitional guided briefs without section headers', () => {
    const details = getCustomizationBriefDetails(
      buildCustomization({
        description: [
          'Brief guiado de alfombra personalizada',
          'Intencion: Infantil',
          'Uso: Regalo',
          'Estilo: Suave',
          'Formato: Forma libre',
          'Tamano base: 70 x 90 cm',
          'Referencia: No tengo referencia'
        ].join('\n')
      })
    );

    expect(details).toMatchObject({
      isGuided: true,
      preview: 'Intencion: Infantil - Uso: Regalo - Estilo: Suave',
      shape: 'Forma libre',
      size: '70 x 90 cm',
      reference: 'No tengo referencia'
    });
  });
});
