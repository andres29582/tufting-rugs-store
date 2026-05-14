import { afterEach, describe, expect, it, vi } from 'vitest';

describe('appConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('enables visual QA mocks from VITE_QA_MODE', async () => {
    vi.stubEnv('VITE_QA_MODE', 'true');

    const config = await loadAppConfig();

    expect(config.qaMode).toBe(true);
    expect(config.useProductMocks).toBe(true);
    expect(config.useCustomizationMocks).toBe(true);
    expect(config.mocksEnabled).toBe(true);
  });

  it('enables visual QA mocks from Vite qa mode', async () => {
    vi.stubEnv('MODE', 'qa');
    vi.stubEnv('PROD', false);

    const config = await loadAppConfig();

    expect(config.qaMode).toBe(true);
    expect(config.useProductMocks).toBe(true);
    expect(config.useCustomizationMocks).toBe(true);
  });

  it('allows domain mock flags to opt out of QA mode', async () => {
    vi.stubEnv('VITE_QA_MODE', 'true');
    vi.stubEnv('VITE_USE_CUSTOMIZATION_MOCKS', 'false');

    const config = await loadAppConfig();

    expect(config.qaMode).toBe(true);
    expect(config.useProductMocks).toBe(true);
    expect(config.useCustomizationMocks).toBe(false);
  });

  it('fails explicitly when QA mode is enabled in production', async () => {
    vi.stubEnv('PROD', true);
    vi.stubEnv('VITE_QA_MODE', 'true');

    await expect(loadAppConfig()).rejects.toThrow(
      'Frontend mocks cannot be enabled in production'
    );
  });
});

async function loadAppConfig() {
  vi.resetModules();
  return (await import('./config')).appConfig;
}
