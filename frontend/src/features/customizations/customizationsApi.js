import { apiRequest } from '../../shared/api/httpClient.js';
import {
  mapCustomizationDraftToApi,
  mapCustomizationFromApi
} from './customizationsMapper.js';

export async function createCustomization(draft) {
  const customization = await apiRequest('/customizations', {
    method: 'POST',
    body: JSON.stringify(mapCustomizationDraftToApi(draft))
  });

  return mapCustomizationFromApi(customization);
}

export async function createOrderFromCustomization(customizationId, payload = {}) {
  return apiRequest('/customizations/' + encodeURIComponent(customizationId) + '/order', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
