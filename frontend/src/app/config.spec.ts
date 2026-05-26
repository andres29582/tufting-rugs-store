import { afterEach, describe, expect, it, vi } from 'vitest';

describe('appConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses local static data in production', async () => {
    vi.stubEnv('PROD', true);
    vi.stubEnv('VITE_API_URL', 'https://api.example.com');

    const config = await loadAppConfig();

    expect(config.apiUrl).toBe('');
    expect(config.useProductMocks).toBe(true);
    expect(config.useCustomizationMocks).toBe(true);
    expect(config.mocksEnabled).toBe(true);
  });

  it('keeps QA mode as an environment label only', async () => {
    vi.stubEnv('MODE', 'qa');
    vi.stubEnv('PROD', false);

    const config = await loadAppConfig();

    expect(config.qaMode).toBe(true);
    expect(config.useProductMocks).toBe(true);
    expect(config.useCustomizationMocks).toBe(true);
  });

  it('ignores legacy mock flags for the static V1', async () => {
    vi.stubEnv('VITE_USE_MOCKS', 'false');
    vi.stubEnv('VITE_USE_PRODUCT_MOCKS', 'false');
    vi.stubEnv('VITE_USE_CUSTOMIZATION_MOCKS', 'false');

    const config = await loadAppConfig();

    expect(config.useProductMocks).toBe(true);
    expect(config.useCustomizationMocks).toBe(true);
  });
});

async function loadAppConfig() {
  vi.resetModules();
  return (await import('./config')).appConfig;
}
