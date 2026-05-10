import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu } from 'lucide-react';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { parseEnterpriseConfig } from '@/lib/utils';
import type { Locale } from '@/i18n';

const langOptions: { name: string; value: Locale }[] = [
    { name: '简体中文', value: 'zh' },
    { name: 'English', value: 'en' },
];

export function Header() {
    const { t, changeLocale } = useTranslations();
    const location = useLocation();
    const navigate = useNavigate();
    const metaConfig = useAppStore((state) => state.metaConfig);

    const menuItems = useMemo(() => {
        const hasBrandValues = Object.keys(parseEnterpriseConfig(metaConfig.brand_values || '')).length > 0;
        const hasServiceScope = Object.keys(parseEnterpriseConfig(metaConfig.service_scope || '')).length > 0;
        const hasBrandHighlights = Object.keys(parseEnterpriseConfig(metaConfig.brand_highlights || '')).length > 0;
        const hasContact = Boolean(metaConfig.contact_picture_url || metaConfig.contact_email || metaConfig.contact_phone);

        return [
            { key: 'Home', target: 'hero', label: t.Home, visible: true },
            { key: 'Vision', target: 'vision', label: t.SpiritAndVision, visible: Boolean(metaConfig.brand_vision) },
            { key: 'Values', target: 'values', label: t.BrandValuesTitle, visible: hasBrandValues },
            { key: 'Services', target: 'services', label: t.ServiceScopeTitle, visible: hasServiceScope },
            { key: 'Highlights', target: 'highlights', label: t.BrandHighlightsTitle, visible: hasBrandHighlights },
            { key: 'Apps', target: 'apps', label: t.ApplicationAndServices, visible: true },
            { key: 'Contact', target: 'contact', label: t.ContactWays, visible: hasContact },
        ].filter((item) => item.visible);
    }, [metaConfig, t]);

    const handleChangeLang = (lang: Locale) => {
        changeLocale(lang);
    };

    const scrollToSection = (target: string) => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleMenuClick = (target: string) => {
        const hash = `#${target}`;

        if (location.pathname !== '/') {
            navigate({ pathname: '/', hash });
            return;
        }

        if (location.hash !== hash) {
            navigate({ pathname: '/', hash });
        }

        window.setTimeout(() => scrollToSection(target), 0);
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
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.key}>
                                    <NavigationMenuLink asChild>
                                        <button
                                            type="button"
                                            onClick={() => handleMenuClick(item.target)}
                                            className="inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                                        >
                                            {item.label}
                                        </button>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="cursor-pointer lg:hidden" aria-label={t.Navigation}>
                                <Menu className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {menuItems.map((item) => (
                                <DropdownMenuItem
                                    key={item.key}
                                    onClick={() => handleMenuClick(item.target)}
                                    className="cursor-pointer"
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-transparent active:bg-transparent cursor-pointer">
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
