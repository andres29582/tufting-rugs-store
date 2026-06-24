import type { ApiOrder, Order, OrderReviewPayload } from '../../../shared/types';
import { resolveApiAssetUrl } from '../../../shared/api/assets';
import { apiRequest } from '../../../shared/api/httpClient';
import { mapOrderFromApi, mapOrdersFromApi } from '../model/ordersMapper';

const productMapperOptions = {
  resolveAssetUrl: resolveApiAssetUrl,
};

export async function getAdminOrders(token: string): Promise<Order[]> {
  const orders = await apiRequest<ApiOrder[]>('/orders', {
    headers: getAdminHeaders(token),
  });

  return mapOrdersFromApi(orders, productMapperOptions);
}

export async function getAdminOrderById(id: string, token: string): Promise<Order> {
  const order = await apiRequest<ApiOrder>('/orders/' + encodeURIComponent(id), {
    headers: getAdminHeaders(token),
  });

  return mapOrderFromApi(order, productMapperOptions);
}

export async function reviewAdminOrder(
  id: string,
  payload: OrderReviewPayload,
  token: string
): Promise<Order> {
  const order = await apiRequest<ApiOrder>('/orders/' + encodeURIComponent(id) + '/review', {
    method: 'PATCH',
    headers: getAdminHeaders(token),
    body: JSON.stringify(payload),
  });

  return mapOrderFromApi(order, productMapperOptions);
}

export async function confirmAdminOrderDeposit(id: string, token: string): Promise<Order> {
  const order = await apiRequest<ApiOrder>(
    '/orders/' + encodeURIComponent(id) + '/confirm-deposit',
    {
      method: 'PATCH',
      headers: getAdminHeaders(token),
    }
  );

  return mapOrderFromApi(order, productMapperOptions);
}

function getAdminHeaders(token: string): HeadersInit {
  return {
    Authorization: 'Bearer ' + token,
  };
}
