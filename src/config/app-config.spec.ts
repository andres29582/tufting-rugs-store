import {
  DEFAULT_DEV_ADMIN_EMAIL,
  DEFAULT_DEV_ADMIN_PASSWORD,
  validateAppConfig
} from './app-config';

const STRONG_SECRET = 'this-is-a-strong-jwt-secret-for-production';

describe('validateAppConfig', () => {
  it('allows local development admin defaults outside production', () => {
    const config = validateAppConfig({
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rugs',
      JWT_SECRET: 'dev-secret'
    });

    expect(config.nodeEnv).toBe('development');
    expect(config.adminEmail).toBe(DEFAULT_DEV_ADMIN_EMAIL);
    expect(config.adminPassword).toBe(DEFAULT_DEV_ADMIN_PASSWORD);
    expect(config.corsOrigins).toContain('http://localhost:5173');
  });

  it('parses explicit CORS origins', () => {
    const config = validateAppConfig({
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rugs',
      JWT_SECRET: 'dev-secret',
      CORS_ORIGINS: 'https://store.example.com, http://localhost:5173'
    });

    expect(config.corsOrigins).toEqual([
      'https://store.example.com',
      'http://localhost:5173'
    ]);
  });

  it('requires DATABASE_URL', () => {
    expect(() =>
      validateAppConfig({
        JWT_SECRET: 'dev-secret'
      })
    ).toThrow('DATABASE_URL is required.');
  });

  it('rejects default admin credentials in production', () => {
    expect(() =>
      validateAppConfig({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rugs',
        JWT_SECRET: STRONG_SECRET,
        ADMIN_EMAIL: DEFAULT_DEV_ADMIN_EMAIL,
        ADMIN_PASSWORD: DEFAULT_DEV_ADMIN_PASSWORD,
        CORS_ORIGINS: 'https://store.example.com'
      })
    ).toThrow('Default development admin email is not allowed in production.');
  });

  it('rejects weak JWT secrets in production', () => {
    expect(() =>
      validateAppConfig({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rugs',
        JWT_SECRET: 'secret',
        ADMIN_EMAIL: 'admin@example.com',
        ADMIN_PASSWORD: 'very-strong-password',
        CORS_ORIGINS: 'https://store.example.com'
      })
    ).toThrow('JWT_SECRET is weak and cannot be used in production.');
  });

  it('requires explicit CORS origins in production', () => {
    expect(() =>
      validateAppConfig({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rugs',
        JWT_SECRET: STRONG_SECRET,
        ADMIN_EMAIL: 'admin@example.com',
        ADMIN_PASSWORD: 'very-strong-password'
      })
    ).toThrow('CORS_ORIGINS is required in production.');
  });

  it('accepts production config with explicit strong values', () => {
    const config = validateAppConfig({
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/rugs',
      JWT_SECRET: STRONG_SECRET,
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'very-strong-password',
      CORS_ORIGINS: 'https://store.example.com'
    });

    expect(config.nodeEnv).toBe('production');
    expect(config.adminEmail).toBe('admin@example.com');
    expect(config.corsOrigins).toEqual(['https://store.example.com']);
  });
});
