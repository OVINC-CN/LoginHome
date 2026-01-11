import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';

const getPageTitle = (pathname: string, t: Record<string, string>): string => {
  if (pathname === '/') return t.Home;
  if (pathname.startsWith('/spirit')) return t.Spirit;
  if (pathname.startsWith('/services')) return t.Services;
  if (pathname.startsWith('/login')) return t.LoginToOVINC;
  if (pathname.startsWith('/reset-password')) return t.ResetPassword;
  if (pathname.startsWith('/agreement/user')) return t.UserAgreement;
  if (pathname.startsWith('/agreement/privacy')) return t.PrivacyAgreement;
  return t.PageNotExist;
};

export function usePageTitle() {
  const location = useLocation();
  const { t } = useTranslations();
  const metaConfig = useAppStore((state) => state.metaConfig);

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname, t);
    const websiteTitle = metaConfig.website_title || 'OVINC';
    document.title = `${pageTitle} | ${websiteTitle}`
  }, [location.pathname, t, metaConfig.website_title]);
}
