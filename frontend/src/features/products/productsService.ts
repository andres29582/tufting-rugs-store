import { appConfig } from '../../app/config';
import { ApiError } from '../../shared/api/apiErrors';
import type { Product } from '../../shared/types';
import { mockProducts, productCategories } from './mockProducts';
import { getProductById, getProductBySlug, getProducts } from './productsApi';

let productsCachePromise: Promise<Product[]> | null = null;

export async function loadProducts(options: { refresh?: boolean } = {}): Promise<Product[]> {
  if (options.refresh === true) {
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

export async function loadFeaturedProducts(
  options: { limit?: number; refresh?: boolean } = {}
): Promise<Product[]> {
  const limit = Number.isInteger(options.limit) ? Number(options.limit) : 4;
  const products = await loadProducts(
    options.refresh === undefined ? {} : { refresh: options.refresh }
  );

  return products.slice(0, limit);
}

export async function loadProductCategories(options: { refresh?: boolean } = {}): Promise<string[]> {
  const products = await loadProducts(options);
  const categories = new Set<string>(productCategories);

  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
  });

  return Array.from(categories);
}

export async function loadProductById(
  id: string,
  options: { refresh?: boolean } = {}
): Promise<Product | null> {
  if (!id) {
    return null;
  }

  if (appConfig.useProductMocks) {
    return findProductById(mockProducts, id);
  }

  try {
    return cloneProduct(await getProductById(id));
  } catch (error) {
    if (!shouldFallbackToProductList(error)) {
      throw error;
    }

    const products = await loadProducts(options);
    return findProductById(products, id);
  }
}

export async function loadProductBySlug(
  slug: string,
  options: { refresh?: boolean } = {}
): Promise<Product | null> {
  if (!slug) {
    return null;
  }

  if (appConfig.useProductMocks) {
    return findProductBySlug(mockProducts, slug);
  }

  try {
    return cloneProduct(await getProductBySlug(slug));
  } catch (error) {
    if (!shouldFallbackToProductList(error)) {
      throw error;
    }

    const products = await loadProducts(options);
    return findProductBySlug(products, slug);
  }
}

export function clearProductsCache(): void {
  productsCachePromise = null;
}

async function resolveProducts(): Promise<Product[]> {
  if (appConfig.useProductMocks) {
    return cloneProducts(mockProducts);
  }

  return getProducts();
}

function findProductById(products: Product[], id: string): Product | null {
  return findProductInList(products, (product) => product.id === id);
}

function findProductBySlug(products: Product[], slug: string): Product | null {
  return findProductInList(products, (product) => product.slug === slug);
}

function findProductInList(
  products: Product[],
  predicate: (product: Product) => boolean
): Product | null {
  const product = products.find(predicate);

  return product ? cloneProduct(product) : null;
}

function shouldFallbackToProductList(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

function cloneProducts(products: Product[]): Product[] {
  return products.map(cloneProduct);
}

function cloneProduct(product: Product): Product {
  return {
    ...product,
    colors: [...product.colors],
    features: [...product.features]
  };
}
