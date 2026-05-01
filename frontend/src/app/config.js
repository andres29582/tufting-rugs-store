const env = import.meta.env || {};

export const appConfig = {
  apiUrl: env.VITE_API_URL || 'http://localhost:3001',
  useMocks: env.VITE_USE_MOCKS !== 'false'
};
