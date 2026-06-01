import type {
  ApiCustomization,
  ApiOrder,
  AdminCustomization,
  Customization,
  CustomizationDraft,
  Order
} from '../../../shared/types';
import { resolveApiAssetUrl } from '../../../shared/api/assets';
import { apiRequest } from '../../../shared/api/httpClient';
import {
  mapAdminCustomizationFromApi,
  mapCustomizationDraftToApi,
  mapCustomizationFromApi
} from '../model/customizationsMapper';
import { mapOrderFromApi } from '../../orders/model/ordersMapper';

const productMapperOptions = {
  resolveAssetUrl: resolveApiAssetUrl
};

export async function createCustomization(draft: CustomizationDraft): Promise<Customization> {
  const customization = await apiRequest<ApiCustomization>('/customizations', {
    method: 'POST',
    body: JSON.stringify(mapCustomizationDraftToApi(draft))
  });

  return mapCustomizationFromApi(customization);
}

export async function createOrderFromCustomization(
  customizationId: string,
  payload: Record<string, unknown> = {}
): Promise<Order> {
  const orderPayload = {
    customizationId,
    ...payload
  };

  const order = await apiRequest<ApiOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload)
  });

  return mapOrderFromApi(order, productMapperOptions);
}

export async function getAdminCustomizations(token: string): Promise<AdminCustomization[]> {
  const customizations = await apiRequest<ApiCustomization[]>('/customizations', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  return Array.isArray(customizations)
    ? customizations.map((customization) =>
        mapAdminCustomizationFromApi(customization, productMapperOptions)
      )
    : [];
}
