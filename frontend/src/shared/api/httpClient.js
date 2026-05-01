import { appConfig } from '../../app/config.js';
import { ApiError } from './apiErrors.js';

export async function apiRequest(path, options = {}) {
  const response = await fetch(appConfig.apiUrl + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(payload), {
      status: response.status,
      payload
    });
  }

  return payload;
}

function getApiErrorMessage(payload) {
  if (!payload) {
    return 'No se pudo conectar con el servidor.';
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(', ');
  }

  return payload.message || 'Ocurrió un error al procesar la solicitud.';
}
