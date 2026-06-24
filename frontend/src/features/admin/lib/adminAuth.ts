import { apiRequest } from '../../../shared/api/httpClient';

const ADMIN_TOKEN_STORAGE_KEY = 'tuft-admin-token';

type AdminLoginResponse = {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    role: string;
  };
};

export async function loginAdmin(email: string, password: string): Promise<AdminLoginResponse> {
  const result = await apiRequest<AdminLoginResponse>('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setAdminToken(result.accessToken);
  return result;
}

export function getAdminToken(): string {
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
}

export function setAdminToken(token: string): void {
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken(): void {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function hasAdminToken(): boolean {
  return Boolean(getAdminToken());
}
