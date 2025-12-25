import { createContext } from 'react';
import type { Locale, Translations } from '@/i18n';

export interface I18nContextType {
  locale: Locale;
  t: Translations;
  changeLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextType | null>(null);
