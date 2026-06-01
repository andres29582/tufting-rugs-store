import { describe, expect, it } from 'vitest';
import {
  createCustomizationDraft,
  normalizeCustomizationDraft,
  validateCustomizationDraft
} from '../lib/customizationDraft';

describe('customizationDraft', () => {
  it('creates a valid default draft shape', () => {
    const draft = createCustomizationDraft();

    expect(draft).toMatchObject({
      productId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      description: '',
      preferredColors: ['#1d2b53', '#f97316', '#db5c91'],
      sizeCategory: 'MEDIUM',
      sizeLabel: '100 x 80 cm',
      format: 'ORGANIC',
      referenceUrl: '',
      notes: ''
    });
  });

  it('normalizes strings, email, size, format and colors', () => {
    const draft = normalizeCustomizationDraft({
      productId: ' product-1 ',
      customerName: ' Cliente ',
      customerEmail: ' CLIENTE@EXAMPLE.COM ',
      customerPhone: ' 123 ',
      description: ' Ideia personalizada ',
      preferredColors: [' #111111 ', '', '#222222', '#333333', '#444444', '#555555', '#666666'],
      sizeCategory: 'LARGE',
      sizeLabel: '',
      format: 'ROUND',
      referenceUrl: ' https://example.com/ref.png ',
      notes: ' Nota '
    });

    expect(draft).toEqual({
      productId: 'product-1',
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      customerPhone: '123',
      description: 'Ideia personalizada',
      preferredColors: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666'],
      sizeCategory: 'LARGE',
      sizeLabel: '120 x 160 cm',
      format: 'ROUND',
      referenceUrl: 'https://example.com/ref.png',
      notes: 'Nota'
    });
  });

  it('falls back to default size and format when invalid values are provided', () => {
    const draft = normalizeCustomizationDraft({
      sizeCategory: 'UNKNOWN' as never,
      format: 'UNKNOWN' as never
    });

    expect(draft.sizeCategory).toBe('MEDIUM');
    expect(draft.sizeLabel).toBe('100 x 80 cm');
    expect(draft.format).toBe('ORGANIC');
  });

  it('validates required customer fields and description', () => {
    const validation = validateCustomizationDraft({
      customerName: '',
      customerEmail: 'not-an-email',
      description: 'short',
      preferredColors: []
    });

    expect(validation.isValid).toBe(false);
    expect(Object.keys(validation.errors).sort()).toEqual([
      'customerEmail',
      'customerName',
      'description'
    ]);
  });

  it('accepts a complete normalized draft', () => {
    const validation = validateCustomizationDraft({
      customerName: 'Cliente',
      customerEmail: 'cliente@example.com',
      description: 'Uma descricao suficientemente detalhada.',
      preferredColors: ['#111111']
    });

    expect(validation.isValid).toBe(true);
    expect(validation.errors).toEqual({});
    expect(validation.draft.customerEmail).toBe('cliente@example.com');
  });
});
