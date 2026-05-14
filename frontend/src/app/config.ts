type RuntimeConfig = {
  apiUrl: string;
  environment: string;
  isProduction: boolean;
  qaMode: boolean;
  useMocks: boolean;
  mocksEnabled: boolean;
  useProductMocks: boolean;
  useCustomizationMocks: boolean;
  useOrderMocks: boolean;
  useAdminMocks: boolean;
  mocks: {
    products: boolean;
    customizations: boolean;
    orders: boolean;
    admin: boolean;
  };
};

const DEFAULT_API_URL = 'http://localhost:3001';
const env = import.meta.env;
const environment = env.MODE || 'development';
const isProduction = Boolean(env.PROD) || environment === 'production';
const requestedMocks = {
  qa: readBooleanEnv(env.VITE_QA_MODE, 'VITE_QA_MODE'),
  all: readBooleanEnv(env.VITE_USE_MOCKS, 'VITE_USE_MOCKS'),
  products: readBooleanEnv(env.VITE_USE_PRODUCT_MOCKS, 'VITE_USE_PRODUCT_MOCKS'),
  customizations: readBooleanEnv(
    env.VITE_USE_CUSTOMIZATION_MOCKS,
    'VITE_USE_CUSTOMIZATION_MOCKS'
  )
};

assertProductionMocksDisabled(isProduction, requestedMocks);

const qaMode = isProduction ? false : (requestedMocks.qa ?? environment === 'qa');
const useMocks = isProduction ? false : (requestedMocks.all ?? qaMode);
const useProductMocks = resolveMockFlag(requestedMocks.products, useMocks, isProduction);
const useCustomizationMocks = resolveMockFlag(
  requestedMocks.customizations,
  useMocks,
  isProduction
);
const useOrderMocks = false;
const useAdminMocks = false;

export const appConfig: RuntimeConfig = {
  apiUrl: normalizeApiUrl(env.VITE_API_URL),
  environment,
  isProduction,
  qaMode,
  useMocks,
  mocksEnabled: useProductMocks || useCustomizationMocks || useOrderMocks || useAdminMocks,
  useProductMocks,
  useCustomizationMocks,
  useOrderMocks,
  useAdminMocks,
  mocks: {
    products: useProductMocks,
    customizations: useCustomizationMocks,
    orders: useOrderMocks,
    admin: useAdminMocks
  }
};

function readBooleanEnv(value: string | undefined, variableName: string): boolean | null {
  if (value === undefined || value === '') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(variableName + ' must be "true" or "false".');
}

function resolveMockFlag(
  specificFlag: boolean | null,
  globalFlag: boolean,
  production: boolean
): boolean {
  if (production) {
    return false;
  }

  return specificFlag ?? globalFlag;
}

function assertProductionMocksDisabled(
  production: boolean,
  flags: Record<string, boolean | null>
): void {
  if (!production) {
    return;
  }

  const enabledFlags = Object.entries(flags)
    .filter(([, value]) => value === true)
    .map(([name]) => name);

  if (enabledFlags.length) {
    throw new Error(
      'Frontend mocks cannot be enabled in production. Disable mock flags: ' +
        enabledFlags.join(', ')
    );
  }
}

function normalizeApiUrl(value: string | undefined): string {
  return String(value || DEFAULT_API_URL).replace(/\/+$/g, '');
}
