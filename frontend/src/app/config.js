const env = import.meta.env || {};
const globalMocks = readBooleanEnv(env.VITE_USE_MOCKS, null);

export const appConfig = {
  apiUrl: env.VITE_API_URL || 'http://localhost:3001',
  useMocks: globalMocks === null ? true : globalMocks
};

function readBooleanEnv(value, fallback) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return fallback;
}
