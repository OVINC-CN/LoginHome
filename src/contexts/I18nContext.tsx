import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { getTranslation, getLocaleFromCookie, setLocaleCookie, type Locale, type Translations } from '@/i18n';
import { changeLangAPI } from '@/api/home';
import { I18nContext } from './context';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(getLocaleFromCookie());
    const [t, setT] = useState<Translations>(getTranslation(locale));

    const changeLocale = useCallback((newLocale: Locale) => {
        const backendLocale = newLocale === 'en' ? 'en' : 'zh-hans';
        changeLangAPI(backendLocale).finally(() => {
            setLocaleCookie(newLocale);
            setLocale(newLocale);
            setT(getTranslation(newLocale));
            window.location.reload();
        });
    }, []);

    const value = useMemo(() => ({ locale, t, changeLocale }), [locale, t, changeLocale]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
