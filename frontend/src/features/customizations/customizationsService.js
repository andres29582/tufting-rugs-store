import { appConfig } from '../../app/config.js';
import { getProducts } from '../products/productsApi.js';
import { loadProducts } from '../products/productsService.js';
import { createCustomization } from './customizationsApi.js';
import {
  createCustomizationDraft,
  normalizeCustomizationDraft,
  validateCustomizationDraft
} from './customizationDraft.js';

const savedDrafts = [];

export function createInitialCustomizationDraft(overrides = {}) {
  return createCustomizationDraft(overrides);
}

export async function saveCustomizationDraft(draft) {
  const validation = validateCustomizationDraft(draft);

  if (!validation.isValid) {
    return {
      ok: false,
      draft: validation.draft,
      errors: validation.errors
    };
  }

  if (appConfig.useMocks) {
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

export function getSavedCustomizationDrafts() {
  return savedDrafts.map(function (draft) {
    return {
      ...draft,
      preferredColors: draft.preferredColors.slice(),
      designReferences: draft.designReferences.slice()
    };
  });
}

async function resolveMockCustomProductId() {
  const products = await loadProducts();
  const customProduct =
    products.find(function (product) {
      return product.category === 'Personalizadas';
    }) ||
    products.find(function (product) {
      return product.customizable;
    });

  return customProduct ? customProduct.id : '';
}

async function resolveApiCustomProductId(selectedProductId) {
  const products = await getProducts();

  const selectedProduct = selectedProductId
    ? products.find(function (product) {
        return product.id === selectedProductId && isFullCustomProduct(product);
      })
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

function isFullCustomProduct(product) {
  return product.type === 'FULL_CUSTOM' || product.category === 'Personalizadas';
}

function createMockCustomization(draft) {
  const normalizedDraft = normalizeCustomizationDraft(draft);

  return {
    id: 'mock-customization-' + Date.now(),
    ...normalizedDraft,
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
