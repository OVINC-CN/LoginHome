import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n';

const langOptions: { name: string; value: Locale }[] = [
  { name: '简体中文', value: 'zh' },
  { name: 'English', value: 'en' },
];

export function Header() {
  const { t, changeLocale } = useTranslations();
  const location = useLocation();
  const metaConfig = useAppStore((state) => state.metaConfig);

  const menuItems = [
    { key: 'Home', path: '/', label: t.Home },
    { key: 'Spirit', path: '/spirit', label: t.Spirit },
    { key: 'Services', path: '/services', label: t.Services },
  ];

  const handleChangeLang = (lang: Locale) => {
    changeLocale(lang);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {metaConfig.logo_url && (
            <Link to="/" className="flex items-center">
              <img src={metaConfig.logo_url} alt="logo" className="h-6" />
            </Link>
          )}
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === item.path && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent active:bg-transparent">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langOptions.map((lang) => (
                <DropdownMenuItem key={lang.value} onClick={() => handleChangeLang(lang.value)}>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
