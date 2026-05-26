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

const env = import.meta.env;
const environment = env.MODE || 'development';
const isProduction = Boolean(env.PROD) || environment === 'production';
const qaMode = environment === 'qa';
const useMocks = true;

export const appConfig: RuntimeConfig = {
  apiUrl: '',
  environment,
  isProduction,
  qaMode,
  useMocks,
  mocksEnabled: true,
  useProductMocks: true,
  useCustomizationMocks: true,
  useOrderMocks: false,
  useAdminMocks: false,
  mocks: {
    products: true,
    customizations: true,
    orders: false,
    admin: false
  }
};
