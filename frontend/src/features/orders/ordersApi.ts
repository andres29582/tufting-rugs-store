import type { ApiOrder, Order, OrderReviewPayload } from '../../shared/types';
import { apiRequest } from '../../shared/api/httpClient';
import { mapOrderFromApi, mapOrdersFromApi } from './ordersMapper';

export async function getAdminOrders(token: string): Promise<Order[]> {
  const orders = await apiRequest<ApiOrder[]>('/orders', {
    headers: getAdminHeaders(token)
  });

  return mapOrdersFromApi(orders);
}

export async function getAdminOrderById(id: string, token: string): Promise<Order> {
  const order = await apiRequest<ApiOrder>('/orders/' + encodeURIComponent(id), {
    headers: getAdminHeaders(token)
  });

  return mapOrderFromApi(order);
}

export async function reviewAdminOrder(
  id: string,
  payload: OrderReviewPayload,
  token: string
): Promise<Order> {
  const order = await apiRequest<ApiOrder>('/orders/' + encodeURIComponent(id) + '/review', {
    method: 'PATCH',
    headers: getAdminHeaders(token),
    body: JSON.stringify(payload)
  });

  return mapOrderFromApi(order);
}

export async function confirmAdminOrderDeposit(id: string, token: string): Promise<Order> {
  const order = await apiRequest<ApiOrder>('/orders/' + encodeURIComponent(id) + '/confirm-deposit', {
    method: 'PATCH',
    headers: getAdminHeaders(token)
  });

  return mapOrderFromApi(order);
}

function getAdminHeaders(token: string): HeadersInit {
  return {
    Authorization: 'Bearer ' + token
  };
}
