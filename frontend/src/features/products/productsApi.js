import { apiRequest } from '../../shared/api/httpClient.js';
import { mapProductFromApi, mapProductsFromApi } from './productsMapper.js';

export async function getProducts() {
  const products = await apiRequest('/products');
  return mapProductsFromApi(products);
}

export async function getProductById(id) {
  const product = await apiRequest('/products/' + encodeURIComponent(id));
  return mapProductFromApi(product);
}
