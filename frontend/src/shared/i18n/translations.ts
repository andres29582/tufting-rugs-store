import { adminTranslations } from './admin.translations';
import { aiTranslations } from './ai.translations';
import { catalogTranslations } from './catalog.translations';
import { commonTranslations } from './common.translations';
import { customizationTranslations } from './customization.translations';

export type Language = 'es' | 'pt';

const es = {
  ...commonTranslations.es,
  ...catalogTranslations.es,
  ...customizationTranslations.es,
  ...aiTranslations.es,
  ...adminTranslations.es
} as const;

export type TranslationKey = keyof typeof es;

const pt = {
  ...commonTranslations.pt,
  ...catalogTranslations.pt,
  ...customizationTranslations.pt,
  ...aiTranslations.pt,
  ...adminTranslations.pt
} satisfies Record<TranslationKey, string>;

export const translations: Record<Language, Record<TranslationKey, string>> = {
  es,
  pt
};
