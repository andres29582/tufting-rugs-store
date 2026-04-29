import { AdminRole } from './admin-domain';

export type AdminLoginInput = {
  email?: string;
  password?: string;
};

export type AdminJwtPayload = {
  sub: string;
  email: string;
  role: AdminRole;
  iat: number;
  exp: number;
};

export type AdminLoginResult = {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    role: AdminRole;
  };
};
