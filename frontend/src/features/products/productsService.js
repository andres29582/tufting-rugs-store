import { appConfig } from '../../app/config.js';
import { getProductById, getProducts, getProductBySlug } from './productsApi.js';
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

  try {
    return cloneProducts(await productsCachePromise);
  } catch (error) {
    clearProductsCache();
    throw error;
  }
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

export async function loadProductById(id, options = {}) {
  if (!id) {
    return null;
  }

  if (appConfig.useMocks) {
    return findProductById(mockProducts, id);
  }

  try {
    const product = await getProductById(id);
    return product ? cloneProduct(product) : null;
  } catch (error) {
    if (!shouldFallbackToProductList(error)) {
      throw error;
    }

    const products = await loadProducts(options);
    return findProductById(products, id);
  }
}

export async function loadProductBySlug(slug, options = {}) {
  if (!slug) {
    return null;
  }

  if (appConfig.useMocks) {
    return findProductBySlug(mockProducts, slug);
  }

  try {
    const product = await getProductBySlug(slug);
    return product ? cloneProduct(product) : null;
  } catch (error) {
    if (!shouldFallbackToProductList(error)) {
      throw error;
    }

    const products = await loadProducts(options);
    return findProductBySlug(products, slug);
  }
}

export function clearProductsCache() {
  productsCachePromise = null;
}

async function resolveProducts() {
  if (appConfig.useMocks) {
    return cloneProducts(mockProducts);
  }

  return getProducts();
}

function findProductById(products, id) {
  return findProductInList(products, function (product) {
    return product.id === id;
  });
}

function findProductBySlug(products, slug) {
  return findProductInList(products, function (product) {
    return product.slug === slug;
  });
}

function findProductInList(products, predicate) {
  const product = products.find(function (item) {
    return predicate(item);
  });

  return product ? cloneProduct(product) : null;
}

function shouldFallbackToProductList(error) {
  return error && error.name === 'ApiError' && error.status === 404;
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
