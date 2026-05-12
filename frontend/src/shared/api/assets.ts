import { appConfig } from '../../app/config';

export function resolveApiAssetUrl(url: string | null | undefined): string {
  const value = String(url || '').trim();

  if (!value || isAbsoluteAssetUrl(value)) {
    return value;
  }

  if (value.startsWith('/')) {
    return trimTrailingSlash(appConfig.apiUrl) + value;
  }

  return value;
}

function isAbsoluteAssetUrl(value: string): boolean {
  return /^(blob:|data:|https?:\/\/)/i.test(value);
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/g, '');
}
