import type { AdminProductPayload, ApiProduct, Product } from '../../../shared/types';
import { resolveApiAssetUrl } from '../../../shared/api/assets';
import { apiFormRequest, apiRequest } from '../../../shared/api/httpClient';
import { mapProductFromApi, mapProductsFromApi } from '../model/productsMapper';

const productMapperOptions = {
  resolveAssetUrl: resolveApiAssetUrl,
};

export async function getProducts(): Promise<Product[]> {
  const products = await apiRequest<ApiProduct[]>('/products');
  return mapProductsFromApi(products, productMapperOptions);
}

export async function getProductById(id: string): Promise<Product> {
  const product = await apiRequest<ApiProduct>('/products/' + encodeURIComponent(id));
  return mapProductFromApi(product, productMapperOptions);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const product = await apiRequest<ApiProduct>('/products/slug/' + encodeURIComponent(slug));
  return mapProductFromApi(product, productMapperOptions);
}

export async function getAdminProducts(token: string): Promise<Product[]> {
  const products = await apiRequest<ApiProduct[]>('/admin/products', {
    headers: getAdminHeaders(token),
  });

  return mapProductsFromApi(products, productMapperOptions);
}

export async function getAdminProductById(id: string, token: string): Promise<Product> {
  const product = await apiRequest<ApiProduct>('/admin/products/' + encodeURIComponent(id), {
    headers: getAdminHeaders(token),
  });

  return mapProductFromApi(product, productMapperOptions);
}

export async function createAdminProduct(
  payload: AdminProductPayload,
  token: string
): Promise<Product> {
  const product = await apiRequest<ApiProduct>('/admin/products', {
    method: 'POST',
    headers: getAdminHeaders(token),
    body: JSON.stringify(payload),
  });

  return mapProductFromApi(product, productMapperOptions);
}

export async function updateAdminProduct(
  id: string,
  payload: Partial<AdminProductPayload>,
  token: string
): Promise<Product> {
  const product = await apiRequest<ApiProduct>('/admin/products/' + encodeURIComponent(id), {
    method: 'PATCH',
    headers: getAdminHeaders(token),
    body: JSON.stringify(payload),
  });

  return mapProductFromApi(product, productMapperOptions);
}

export async function publishAdminProduct(id: string, token: string): Promise<Product> {
  const product = await apiRequest<ApiProduct>(
    '/admin/products/' + encodeURIComponent(id) + '/publish',
    {
      method: 'PATCH',
      headers: getAdminHeaders(token),
    }
  );

  return mapProductFromApi(product, productMapperOptions);
}

export async function unpublishAdminProduct(id: string, token: string): Promise<Product> {
  const product = await apiRequest<ApiProduct>(
    '/admin/products/' + encodeURIComponent(id) + '/unpublish',
    {
      method: 'PATCH',
      headers: getAdminHeaders(token),
    }
  );

  return mapProductFromApi(product, productMapperOptions);
}

export async function uploadAdminProductImage(
  file: File,
  token: string
): Promise<{
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const upload = await apiFormRequest<{
    url: string;
    storageKey: string;
    originalName: string;
    mimeType: string;
    size: number;
  }>('/admin/uploads/product-images', formData, {
    method: 'POST',
    headers: getAdminHeaders(token),
  });

  return {
    ...upload,
    url: resolveApiAssetUrl(upload.url),
  };
}

function getAdminHeaders(token: string): HeadersInit {
  return {
    Authorization: 'Bearer ' + token,
  };
}
