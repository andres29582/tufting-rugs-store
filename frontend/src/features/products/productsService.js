import { appConfig } from '../../app/config.js';
import { getProductById, getProducts } from './productsApi.js';
import { mockProducts, productCategories } from './mockProducts.js';

let productsCachePromise = null;

export async function loadProducts(options = {}) {
  const shouldRefresh = options.refresh === true;

  if (shouldRefresh) {
    clearProductsCache();
  }

  if (!productsCachePromise) {
    productsCachePromise = resolveProducts();
  }

  return cloneProducts(await productsCachePromise);
}

export async function loadFeaturedProducts(options = {}) {
  const limit = Number.isInteger(options.limit) ? options.limit : 4;
  const products = await loadProducts(options);

  return products.slice(0, limit);
}

export async function loadProductCategories(options = {}) {
  const products = await loadProducts(options);
  const categories = new Set(productCategories);

  products.forEach(function (product) {
    if (product.category) {
      categories.add(product.category);
    }
  });

  return Array.from(categories);
}

export async function loadProductBySlug(slugOrId, options = {}) {
  if (!slugOrId) {
    return null;
  }

  if (appConfig.useMocks) {
    return findProductInList(mockProducts, slugOrId);
  }

  try {
    const product = await getProductById(slugOrId);
    return product ? cloneProduct(product) : null;
  } catch (error) {
    const products = await loadProducts(options);
    return findProductInList(products, slugOrId);
  }
}

export function clearProductsCache() {
  productsCachePromise = null;
}

async function resolveProducts() {
  if (appConfig.useMocks) {
    return cloneProducts(mockProducts);
  }

  try {
    return await getProducts();
  } catch (error) {
    console.warn('No se pudieron cargar productos desde la API. Usando mocks temporales.', error);
    return cloneProducts(mockProducts);
  }
}

function findProductInList(products, slugOrId) {
  const product = products.find(function (item) {
    return item.slug === slugOrId || item.id === slugOrId;
  });

  return product ? cloneProduct(product) : null;
}

function cloneProducts(products) {
  return products.map(cloneProduct);
}

function cloneProduct(product) {
  return {
    ...product,
    colors: Array.isArray(product.colors) ? product.colors.slice() : [],
    features: Array.isArray(product.features) ? product.features.slice() : []
  };
}
