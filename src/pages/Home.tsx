import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Layers, Mail, Phone, RotateCcw } from 'lucide-react';
import { listAllAppAPI, type App } from '@/api/app';
import { ApplicationDisplay } from '@/components/ApplicationDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import { cn, parseEnterpriseConfig, type EnterpriseConfig } from '@/lib/utils';

interface FlipCardProps {
  isFlipped: boolean;
  onFlip: () => void;
  frontContent: ReactNode;
  backContent: ReactNode;
  className?: string;
}

interface SectionHeaderProps {
  title: string;
  description: string;
}

interface EnterpriseSectionProps extends SectionHeaderProps {
  id: string;
  items: EnterpriseConfig;
  accent: 'blue' | 'purple' | 'emerald';
  variant: 'cards' | 'list' | 'panel';
}

function parseTextContent(text: string): { paragraphs: string[][] } {
    if (!text) {
        return { paragraphs: [] };
    }

    const rawParagraphs = text.split(/\n{2,}|\r\n{2,}/).filter((p) => p.trim());

    const paragraphs = rawParagraphs.map((paragraph) => {
        const sentences = paragraph
            .split(/(?<=[。！？.!?.])\s*/)
            .map((s) => s.trim())
            .filter((s) => s);
        return sentences.length > 0 ? sentences : [paragraph.trim()];
    });

    return { paragraphs };
}

function FlipCard({ isFlipped, onFlip, frontContent, backContent, className = '' }: FlipCardProps) {
    return (
        <div
            className={`flip-card cursor-pointer ${isFlipped ? 'flipped' : ''} ${className}`}
            onClick={onFlip}
            style={{ minHeight: '180px' }}
        >
            <div className="flip-card-inner">
                {isFlipped ? <div className="flip-card-back">{backContent}</div> : <div className="flip-card-front">{frontContent}</div>}
            </div>
        </div>
    );
}

function SectionHeader({ title, description }: SectionHeaderProps) {
    return (
        <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
                {title}
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-400 md:text-lg">
                {description}
            </p>
        </div>
    );
}

function EnterpriseSection({ id, title, description, items, accent, variant }: EnterpriseSectionProps) {
    const entries = Object.entries(items);

    if (entries.length === 0) {
        return null;
    }

    if (variant === 'list') {
        return (
            <section id={id} className="scroll-mt-14 bg-neutral-50/60 px-6 py-20 dark:bg-neutral-900/30">
                <div className="mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                    <div className="lg:sticky lg:top-24">
                        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-7 text-neutral-500 dark:text-neutral-400 md:text-lg">
                            {description}
                        </p>
                    </div>
                    <div className="space-y-4">
                        {entries.map(([key, values]) => (
                            <div key={key} className="rounded-3xl bg-white/80 p-6 dark:bg-neutral-950/70 md:p-7">
                                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{key}</h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {values.map((value) => (
                                        <div key={value} className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (variant === 'panel') {
        return (
            <section id={id} className="scroll-mt-14 px-6 py-20">
                <div className="mx-auto w-full max-w-[1280px] rounded-[2rem] bg-gradient-to-br from-neutral-50 to-emerald-50/50 px-6 py-14 dark:from-neutral-900 dark:to-emerald-950/20 md:px-10">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-400 md:text-lg">
                            {description}
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {entries.map(([key, values]) => (
                            <div key={key} className="rounded-3xl bg-white/75 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:bg-neutral-950/60 dark:hover:bg-neutral-950">
                                <h3 className="mb-5 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{key}</h3>
                                <div className="space-y-3">
                                    {values.map((value) => (
                                        <p key={value} className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id={id} className="scroll-mt-14 px-6 py-20">
            <div className="mx-auto w-full max-w-[1280px]">
                <SectionHeader title={title} description={description} />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {entries.map(([key, values]) => (
                        <div
                            key={key}
                            className={cn(
                                'group rounded-3xl bg-neutral-50 p-8 transition-all duration-300 hover:-translate-y-1 dark:bg-neutral-900',
                                accent === 'blue' && 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
                                accent === 'purple' && 'hover:bg-purple-50 dark:hover:bg-purple-950/30',
                                accent === 'emerald' && 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
                            )}
                        >
                            <div
                                className={cn(
                                    'mb-6 h-1.5 w-12 rounded-full transition-all duration-300 group-hover:w-16',
                                    accent === 'blue' && 'bg-blue-500',
                                    accent === 'purple' && 'bg-purple-500',
                                    accent === 'emerald' && 'bg-emerald-500',
                                )}
                            />
                            <h3 className="mb-5 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{key}</h3>
                            <div className="space-y-3">
                                {values.map((value) => (
                                    <div key={value} className="flex gap-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                                        <span
                                            className={cn(
                                                'mt-2 h-1.5 w-1.5 shrink-0 rounded-full',
                                                accent === 'blue' && 'bg-blue-500',
                                                accent === 'purple' && 'bg-purple-500',
                                                accent === 'emerald' && 'bg-emerald-500',
                                            )}
                                        />
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Home() {
    const { t } = useTranslations();
    const location = useLocation();
    const metaConfig = useAppStore((state) => state.metaConfig);
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
    const [apps, setApps] = useState<App[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);

    const brandValues = useMemo(() => parseEnterpriseConfig(metaConfig.brand_values || ''), [metaConfig.brand_values]);
    const serviceScope = useMemo(() => parseEnterpriseConfig(metaConfig.service_scope || ''), [metaConfig.service_scope]);
    const brandHighlights = useMemo(() => parseEnterpriseConfig(metaConfig.brand_highlights || ''), [metaConfig.brand_highlights]);
    const visionContent = useMemo(() => parseTextContent(metaConfig.brand_vision || ''), [metaConfig.brand_vision]);

    useEffect(() => {
        listAllAppAPI()
            .then((res) => {
                setApps(res);
            })
            .finally(() => setLoadingApps(false));
    }, []);

    useEffect(() => {
        if (!location.hash) {
            return undefined;
        }

        const targetId = decodeURIComponent(location.hash.slice(1));
        const timer = window.setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        return () => window.clearTimeout(timer);
    }, [location.hash]);

    const toggleFlip = (cardId: string) => {
        setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    return (
        <div className="flex flex-col">
            <section id="hero" className="relative flex min-h-[calc(100vh-3.5rem)] scroll-mt-14 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
                {metaConfig.brand_title && (
                    <div className="relative z-10 mx-4 max-w-4xl text-center">
                        <h1
                            className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 md:text-2xl lg:text-3xl"
                            dangerouslySetInnerHTML={{ __html: metaConfig.brand_title }}
                        />
                        {metaConfig.brand_desc && (
                            <p
                                className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 md:text-xl"
                                dangerouslySetInnerHTML={{ __html: metaConfig.brand_desc }}
                            />
                        )}
                    </div>
                )}
            </section>

            {metaConfig.brand_vision && (
                <section id="vision" className="scroll-mt-14 bg-neutral-50/60 px-6 py-20 dark:bg-neutral-900/30">
                    <div className="mx-auto grid w-full max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <span className="mb-5 block h-1.5 w-16 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
                                {t.SpiritAndVision}
                            </h2>
                            <p className="mt-4 max-w-lg text-base leading-7 text-neutral-500 dark:text-neutral-400 md:text-lg">
                                {t.SpiritAndVisionDesc}
                            </p>
                        </div>
                        <div className="rounded-[2rem] bg-white/80 p-8 dark:bg-neutral-950/70 md:p-10">
                            <div className="mb-6 text-5xl font-semibold leading-none text-neutral-200 dark:text-neutral-800">“</div>
                            <div className="space-y-5">
                                {visionContent.paragraphs.map((paragraph) => (
                                    <p key={paragraph.join('')} className="text-base leading-8 text-neutral-700 dark:text-neutral-300 md:text-lg">
                                        {paragraph.map((sentence) => (
                                            <span key={sentence}>{sentence} </span>
                                        ))}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <EnterpriseSection
                id="values"
                title={t.BrandValuesTitle}
                description={t.BrandValuesDesc}
                items={brandValues}
                accent="blue"
                variant="cards"
            />

            <EnterpriseSection
                id="services"
                title={t.ServiceScopeTitle}
                description={t.ServiceScopeDesc}
                items={serviceScope}
                accent="purple"
                variant="list"
            />

            <EnterpriseSection
                id="highlights"
                title={t.BrandHighlightsTitle}
                description={t.BrandHighlightsDesc}
                items={brandHighlights}
                accent="emerald"
                variant="panel"
            />

            <section id="apps" className="scroll-mt-14 bg-neutral-50/60 px-6 py-20 dark:bg-neutral-900/30">
                <div className="mx-auto w-full max-w-[1280px]">
                    <SectionHeader title={t.ApplicationAndServices} description={t.ApplicationAndServicesDesc} />
                    {loadingApps ? (
                        <div className="flex flex-wrap justify-center gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-full rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-6 w-32" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-4/5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : apps.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-6">
                            {apps.map((app) => (
                                <div key={app.app_code} className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                                    <ApplicationDisplay app={app} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-12 dark:bg-neutral-900">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Layers className="h-6 w-6 text-neutral-400" />
                            </div>
                            <p className="text-lg text-neutral-500 dark:text-neutral-400">{t.noMore}</p>
                        </div>
                    )}
                </div>
            </section>

            {(metaConfig.contact_picture_url || metaConfig.contact_email || metaConfig.contact_phone) && (
                <section id="contact" className="scroll-mt-14 bg-neutral-50/60 py-20 dark:bg-neutral-900/30">
                    <div className="mx-auto w-full max-w-5xl px-6">
                        <h2 className="mb-4 text-center text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
                            {t.ContactWays}
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-center text-neutral-500 dark:text-neutral-400">
                            {t.ContactUsDesc}
                        </p>
                        <div className="flex flex-wrap justify-center gap-8">
                            {metaConfig.contact_picture_url && (
                                <FlipCard
                                    isFlipped={!!flippedCards['qrcode']}
                                    onFlip={() => toggleFlip('qrcode')}
                                    className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                                    frontContent={
                                        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800/50">
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                                                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                </svg>
                                            </div>
                                            <h3 className="mb-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.ScanQRCode}</h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.ClickToFlip}</p>
                                        </div>
                                    }
                                    backContent={
                                        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800/50">
                                            <img
                                                src={metaConfig.contact_picture_url}
                                                alt="contact"
                                                className="h-36 w-36 rounded-lg object-contain"
                                            />
                                            <p className="mt-4 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                <RotateCcw className="h-3 w-3" />
                                                {t.ClickToFlipBack}
                                            </p>
                                        </div>
                                    }
                                />
                            )}
                            {metaConfig.contact_email && (
                                <FlipCard
                                    isFlipped={!!flippedCards['email']}
                                    onFlip={() => toggleFlip('email')}
                                    className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                                    frontContent={
                                        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800/50">
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
                                                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.Email}</h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.ClickToFlip}</p>
                                        </div>
                                    }
                                    backContent={
                                        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800/50">
                                            <a
                                                href={`mailto:${metaConfig.contact_email}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-lg font-medium text-neutral-900 transition-colors hover:text-blue-600 dark:text-neutral-100 dark:hover:text-blue-400"
                                            >
                                                {metaConfig.contact_email}
                                            </a>
                                            <p className="mt-4 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                <RotateCcw className="h-3 w-3" />
                                                {t.ClickToFlipBack}
                                            </p>
                                        </div>
                                    }
                                />
                            )}
                            {metaConfig.contact_phone && (
                                <FlipCard
                                    isFlipped={!!flippedCards['phone']}
                                    onFlip={() => toggleFlip('phone')}
                                    className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                                    frontContent={
                                        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800/50">
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/30">
                                                <Phone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <h3 className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.PhoneNumber}</h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.ClickToFlip}</p>
                                        </div>
                                    }
                                    backContent={
                                        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-neutral-800/50">
                                            <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                                {metaConfig.contact_phone}
                                            </span>
                                            <p className="mt-4 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                <RotateCcw className="h-3 w-3" />
                                                {t.ClickToFlipBack}
                                            </p>
                                        </div>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
