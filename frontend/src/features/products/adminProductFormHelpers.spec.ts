import { describe, expect, it } from 'vitest';
import { buildProduct } from '../../shared/test/builders';
import {
  createInitialProductForm,
  mapAdminProductFormToPayload,
  mapProductToAdminForm,
  slugifyAdminProduct,
  splitAdminProductList
} from './adminProductFormHelpers';

describe('adminProductFormHelpers', () => {
  it('creates the default admin product form state', () => {
    const form = createInitialProductForm();

    expect(form).toMatchObject({
      type: 'READY_MADE',
      basePrice: '',
      category: 'Decorativas',
      sizeCategory: 'MEDIUM',
      format: 'RECTANGULAR',
      isCustomizable: true,
      isFeatured: false,
      isActive: false
    });
    expect(form.colorsText).toContain('#1d2b53');
  });

  it('maps products into admin form state', () => {
    const product = buildProduct({
      name: 'Produto Admin',
      slug: 'produto-admin',
      priceFrom: 175,
      colors: ['#111111', '#222222', '#333333'],
      features: ['Feature A', 'Feature B'],
      isActive: true
    });

    expect(mapProductToAdminForm(product)).toMatchObject({
      name: 'Produto Admin',
      slug: 'produto-admin',
      basePrice: '175',
      colorsText: '#111111\n#222222\n#333333',
      featuresText: 'Feature A\nFeature B',
      isActive: true
    });
  });

  it('normalizes admin product payloads', () => {
    const payload = mapAdminProductFormToPayload({
      ...createInitialProductForm(),
      name: '  Tapete Especial  ',
      slug: '',
      description: '  Descricao  ',
      basePrice: '150,50',
      category: '  Decorativas  ',
      imageUrl: '  ',
      colorsText: '#111111, #222222\n#333333',
      featuresText: 'Feature A\n\nFeature B',
      material: '  Lana  ',
      productionTime: ' 12 dias ',
      isActive: true
    });

    expect(payload).toEqual({
      name: 'Tapete Especial',
      slug: 'tapete-especial',
      description: 'Descricao',
      type: 'READY_MADE',
      basePriceCents: 15050,
      sizeCategory: 'MEDIUM',
      sizeLabel: '100 x 80 cm',
      format: 'RECTANGULAR',
      category: 'Decorativas',
      imageUrl: null,
      colors: ['#111111', '#222222', '#333333'],
      features: ['Feature A', 'Feature B'],
      material: 'Lana',
      productionTime: '12 dias',
      isCustomizable: true,
      isFeatured: false,
      isActive: true
    });
  });

  it('rejects invalid prices', () => {
    expect(() =>
      mapAdminProductFormToPayload({
        ...createInitialProductForm(),
        name: 'Produto',
        basePrice: '-1'
      })
    ).toThrow('Ingresa un precio base valido.');
  });

  it('slugifies names and splits list fields', () => {
    expect(slugifyAdminProduct('  Círculos & Líneas 2026  ')).toBe('circulos-lineas-2026');
    expect(splitAdminProductList('A, B\n\nC')).toEqual(['A', 'B', 'C']);
  });
});
