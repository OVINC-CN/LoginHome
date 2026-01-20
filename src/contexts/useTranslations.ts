import { useContext } from 'react';
import { I18nContext } from './context';

export function useTranslations() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslations must be used within an I18nProvider');
    }
    return context;
}
