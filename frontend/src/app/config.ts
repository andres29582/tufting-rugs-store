const env = import.meta.env;
const globalMocks = readBooleanEnv(env.VITE_USE_MOCKS, null);

export const appConfig = {
  apiUrl: env.VITE_API_URL || 'http://localhost:3001',
  useMocks: globalMocks === null ? true : globalMocks,
  useProductMocks: readBooleanEnv(env.VITE_USE_PRODUCT_MOCKS, globalMocks ?? false),
  useCustomizationMocks: readBooleanEnv(
    env.VITE_USE_CUSTOMIZATION_MOCKS,
    globalMocks ?? false
  )
};

function readBooleanEnv(value: string | undefined, fallback: boolean | null): boolean | null {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return fallback;
}
