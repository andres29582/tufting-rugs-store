import { appConfig } from '../../app/config';
import type {
  Customization,
  CustomizationDraft,
  Order,
  Product,
  SaveCustomizationResult
} from '../../shared/types';
import { getProducts } from '../products/productsApi';
import { loadProducts } from '../products/productsService';
import {
  createCustomizationDraft,
  normalizeCustomizationDraft,
  validateCustomizationDraft
} from './customizationDraft';
import { createCustomization, createOrderFromCustomization as createOrderFromCustomizationApi } from './customizationsApi';

const savedDrafts: Customization[] = [];

export function createInitialCustomizationDraft(
  overrides: Partial<CustomizationDraft> = {}
): CustomizationDraft {
  return createCustomizationDraft(overrides);
}

export async function saveCustomizationDraft(
  draft: CustomizationDraft
): Promise<SaveCustomizationResult> {
  const validation = validateCustomizationDraft(draft);

  if (!validation.isValid) {
    return {
      ok: false,
      draft: validation.draft,
      errors: validation.errors
    };
  }

  if (appConfig.useCustomizationMocks) {
    const preparedDraft = {
      ...validation.draft,
      productId: validation.draft.productId || (await resolveMockCustomProductId())
    };
    const savedDraft = createMockCustomization(preparedDraft);
    savedDrafts.unshift(savedDraft);

    return {
      ok: true,
      customization: savedDraft,
      mode: 'mock'
    };
  }

  const preparedDraft = {
    ...validation.draft,
    productId: await resolveApiCustomProductId(validation.draft.productId)
  };
  const customization = await createCustomization(preparedDraft);

  return {
    ok: true,
    customization,
    mode: 'api'
  };
}

export async function createOrderFromCustomization(
  customizationId: string,
  payload: Record<string, unknown> = {}
): Promise<Order> {
  if (appConfig.useCustomizationMocks) {
    const customization = savedDrafts.find(c => c.id === customizationId);
    if (!customization) {
      throw new Error('Customization not found in mock data');
    }
    return createMockOrder(customization);
  }

  return createOrderFromCustomizationApi(customizationId, payload);
}

export function getSavedCustomizationDrafts(): Customization[] {
  return savedDrafts.map((draft) => ({
    ...draft,
    preferredColors: [...draft.preferredColors],
    designReferences: [...draft.designReferences]
  }));
}

async function resolveMockCustomProductId(): Promise<string> {
  const products = await loadProducts();
  const customProduct =
    products.find((product) => product.category === 'Personalizadas') ||
    products.find((product) => product.customizable);

  return customProduct ? customProduct.id : '';
}

async function resolveApiCustomProductId(selectedProductId: string): Promise<string> {
  const products = await getProducts();
  const selectedProduct = selectedProductId
    ? products.find((product) => product.id === selectedProductId && isFullCustomProduct(product))
    : null;

  if (selectedProduct) {
    return selectedProduct.id;
  }

  const customProduct = products.find(isFullCustomProduct);

  if (!customProduct) {
    throw new Error('No encontramos un producto personalizado activo para enviar la solicitud.');
  }

  return customProduct.id;
}

function isFullCustomProduct(product: Product): boolean {
  return product.type === 'FULL_CUSTOM' || product.category === 'Personalizadas';
}

function createMockCustomization(draft: CustomizationDraft): Customization {
  const normalizedDraft = normalizeCustomizationDraft(draft);

  return {
    id: 'mock-customization-' + Date.now(),
    productId: normalizedDraft.productId,
    customerName: normalizedDraft.customerName,
    customerEmail: normalizedDraft.customerEmail,
    customerPhone: normalizedDraft.customerPhone,
    description: normalizedDraft.description,
    preferredColors: normalizedDraft.preferredColors,
    sizeCategory: normalizedDraft.sizeCategory,
    sizeLabel: normalizedDraft.sizeLabel,
    format: normalizedDraft.format,
    designReferences: normalizedDraft.referenceUrl
      ? [
          {
            kind: 'CUSTOMER_REFERENCE',
            url: normalizedDraft.referenceUrl
          }
        ]
      : [],
    createdAt: new Date().toISOString()
  };
}

function createMockOrder(customization: Customization): Order {
  return {
    id: 'mock-order-' + Date.now(),
    publicCode: 'RUG-' + formatDateForCode(new Date()) + '-MOCK',
    productId: customization.productId,
    customizationId: customization.id,
    customerName: customization.customerName,
    customerEmail: customization.customerEmail,
    customerPhone: customization.customerPhone,
    status: 'WAITING_ANALYSIS',
    estimatedPriceCents: null,
    finalPriceCents: null,
    depositAmountCents: null,
    depositPaid: false,
    productionPossible: true,
    notes: '',
    createdAt: new Date().toISOString(),
    product: null,
    customization,
    designReferences: [],
    adminReviews: []
  };
}

function formatDateForCode(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('');
}
