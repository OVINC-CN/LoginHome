import zhHans from './locales/zh.json';
import en from './locales/en.json';

export type Locale = 'zh' | 'en';
export type Translations = typeof zhHans;

const translations: Record<Locale, Translations> = {
    zh: zhHans,
    en,
};

export const getTranslation = (lang: string): Translations => {
    const locale = (lang === 'en' ? 'en' : 'zh') as Locale;
    return translations[locale];
};

export const getLocaleFromCookie = (): Locale => {
    if (typeof document === 'undefined') {
        return 'zh';
    }
    const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
    const locale = match ? match[1] : 'zh';
    return locale === 'en' ? 'en' : 'zh';
};

export const setLocaleCookie = (locale: Locale) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
};

export { zhHans, en };
