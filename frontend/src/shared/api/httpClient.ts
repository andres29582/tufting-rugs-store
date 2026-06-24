import { appConfig } from '../../app/config';
import { ApiError } from './apiErrors';

type ErrorPayload = {
  message?: string | string[];
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(appConfig.apiUrl + path, {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(payload), {
      status: response.status,
      payload,
    });
  }

  return payload as T;
}

export async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  const response = await fetch(appConfig.apiUrl + path, {
    ...options,
    body: formData,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(payload), {
      status: response.status,
      payload,
    });
  }

  return payload as T;
}

function getApiErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'No se pudo conectar con el servidor.';
  }

  const message = (payload as ErrorPayload).message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message || 'Ocurrió un error al procesar la solicitud.';
}
