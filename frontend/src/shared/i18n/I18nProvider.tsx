import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from './translations';

type TranslationParams = Record<string, string | number>;
export type Translate = (key: TranslationKey, params?: TranslationParams) => string;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translate;
};

const storageKey = 'tuft-atelier-language';
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'es';
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key, params) => interpolate(translations[language][key] || translations.es[key], params),
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used inside I18nProvider.');
  }

  return context;
}

function getInitialLanguage(): Language {
  const storedLanguage = window.localStorage.getItem(storageKey);

  if (storedLanguage === 'es' || storedLanguage === 'pt') {
    return storedLanguage;
  }

  return 'pt';
}

function interpolate(value: string, params: TranslationParams = {}): string {
  return Object.entries(params).reduce(
    (message, [key, replacement]) => message.replaceAll('{' + key + '}', String(replacement)),
    value
  );
}
