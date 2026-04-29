export type AppEnvironment = 'development' | 'test' | 'production';

export type AppConfig = {
  nodeEnv: AppEnvironment;
  databaseUrl: string;
  jwtSecret: string;
  adminEmail: string;
  adminPassword: string;
  port: number;
};

export const DEFAULT_DEV_ADMIN_EMAIL = 'admin@rugs.local';
export const DEFAULT_DEV_ADMIN_PASSWORD = 'admin123';

const WEAK_JWT_SECRETS = new Set([
  'change-me',
  'changeme',
  'secret',
  'admin',
  'password',
  'jwt_secret',
  'replace-with-a-strong-secret'
]);

export function validateAppConfig(env: NodeJS.ProcessEnv): AppConfig {
  const nodeEnv = parseNodeEnv(env.NODE_ENV);
  const databaseUrl = requireEnv(env.DATABASE_URL, 'DATABASE_URL');
  const jwtSecret = requireEnv(env.JWT_SECRET, 'JWT_SECRET');
  const adminEmail = env.ADMIN_EMAIL || DEFAULT_DEV_ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD || DEFAULT_DEV_ADMIN_PASSWORD;
  const port = parsePort(env.PORT);

  if (nodeEnv === 'production') {
    if (!env.ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL is required in production.');
    }

    if (!env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_PASSWORD is required in production.');
    }

    if (adminEmail === DEFAULT_DEV_ADMIN_EMAIL) {
      throw new Error('Default development admin email is not allowed in production.');
    }

    if (adminPassword === DEFAULT_DEV_ADMIN_PASSWORD) {
      throw new Error('Default development admin password is not allowed in production.');
    }

    if (adminPassword.length < 12) {
      throw new Error('ADMIN_PASSWORD must be at least 12 characters in production.');
    }

    if (isWeakJwtSecret(jwtSecret)) {
      throw new Error('JWT_SECRET is weak and cannot be used in production.');
    }
  }

  return {
    nodeEnv,
    databaseUrl,
    jwtSecret,
    adminEmail,
    adminPassword,
    port
  };
}

export function isWeakJwtSecret(secret: string): boolean {
  const normalized = secret.trim().toLowerCase();
  return normalized.length < 32 || WEAK_JWT_SECRETS.has(normalized);
}

function parseNodeEnv(value: string | undefined): AppEnvironment {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }

  return 'development';
}

function parsePort(value: string | undefined): number {
  if (!value) {
    return 3001;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
  }

  return port;
}

function requireEnv(value: string | undefined, name: string): string {
  if (!value?.trim()) {
    throw new Error(`${name} is required.`);
  }

  return value;
}
