import { describe, expect, it } from 'vitest';
import type { ApiProduct } from '../../../shared/types';
import { mapProductFromApi, mapProductsFromApi, normalizeProductImageUrl } from './productsMapper';

describe('productsMapper', () => {
  it('maps a complete API product into frontend product shape', () => {
    const product = mapProductFromApi({
      id: 'api-product-1',
      slug: 'api-product',
      type: 'READY_MADE',
      name: 'API Product',
      category: 'Decorativas',
      description: 'Produto vindo da API.',
      basePriceCents: 12550,
      sizeCategory: 'MEDIUM',
      format: 'RECTANGULAR',
      sizeLabel: '100 x 80 cm',
      imageUrl: 'https://cdn.example.com/rug.png',
      colors: ['#111111', '#222222', '#333333', '#444444'],
      features: ['Feature 1'],
      material: 'Lana',
      productionTime: '10 dias',
      isCustomizable: true,
      isFeatured: true,
      isActive: false,
      motif: 'organic',
    });

    expect(product).toMatchObject({
      id: 'api-product-1',
      slug: 'api-product',
      type: 'READY_MADE',
      name: 'API Product',
      category: 'Decorativas',
      priceFrom: 126,
      basePriceCents: 12550,
      size: '100 x 80 cm',
      imageUrl: 'https://cdn.example.com/rug.png',
      isActive: false,
      motif: 'organic',
    });
    expect(product.colors).toEqual(['#111111', '#222222', '#333333', '#444444']);
    expect(product.features).toEqual(['Feature 1']);
  });

  it('applies defaults and fallbacks for sparse API products', () => {
    const product = mapProductFromApi({
      id: 'custom-product',
      type: 'FULL_CUSTOM',
      name: 'Custom Product',
      priceFromCents: 18000,
      colors: ['#111111'],
    });

    expect(product).toMatchObject({
      slug: 'custom-product',
      category: 'Personalizadas',
      priceFrom: 180,
      size: 'A medida',
      sizeCategory: 'CUSTOM',
      format: 'CUSTOM',
      isActive: true,
      isFeatured: false,
      motif: 'waves',
    });
    expect(product.colors).toEqual(['#1d2b53', '#f97316', '#db5c91']);
    expect(product.features).toHaveLength(3);
    expect(product.features).toContain('100% personalizable');
    expect(product.features).toContain('Medidas flexibles');
  });

  it('maps arrays and ignores non-array inputs', () => {
    const products: ApiProduct[] = [
      { id: 'one', name: 'One' },
      { id: 'two', name: 'Two' },
    ];

    expect(mapProductsFromApi(products)).toHaveLength(2);
    expect(mapProductsFromApi(null)).toEqual([]);
  });

  it('keeps asset resolution injectable and pure', () => {
    const product = mapProductFromApi(
      {
        id: 'image-product',
        name: 'Image Product',
        imageUrl: '/uploads/product-images/rug.png',
      },
      {
        resolveAssetUrl: (url) => 'https://api.example.com' + url,
      }
    );

    expect(product.imageUrl).toBe('https://api.example.com/uploads/product-images/rug.png');
    expect(normalizeProductImageUrl('/relative.png')).toBe('/relative.png');
  });
});
