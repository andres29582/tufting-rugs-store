import { validateAppConfig } from './app-config';

export const APP_CONFIG = Symbol('APP_CONFIG');

export const appConfigProvider = {
  provide: APP_CONFIG,
  useFactory: () => validateAppConfig(process.env)
};
