import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import Markdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';

export function Agreement() {
    const { type } = useParams<{ type: string }>();
    const { t } = useTranslations();
    const metaConfig = useAppStore((state) => state.metaConfig);

    const agreement = type === 'user' ? metaConfig.user_agreement : metaConfig.privacy_agreement;
    const title = type === 'user' ? t.UserAgreement : t.PrivacyAgreement;

    return (
        <div className="min-h-[calc(100vh-3.5rem)]">
            <section className="px-4 pb-4 pt-12">
                <div className="mx-auto w-full max-w-7xl text-center">
                    <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">{title}</h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        {type === 'user' ? t.UserAgreementDesc : t.PrivacyAgreementDesc}
                    </p>
                </div>
            </section>

            <section className="px-4 pb-12 pt-6">
                <div className="mx-auto w-full max-w-7xl">
                    {agreement ? (
                        <article className="prose prose-neutral max-w-none leading-8 dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-neutral-200 prose-h2:pb-3 prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-neutral-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:text-neutral-600 prose-ol:text-neutral-600 prose-li:marker:text-neutral-400 dark:prose-h2:border-neutral-800 dark:prose-p:text-neutral-400 dark:prose-ul:text-neutral-400 dark:prose-ol:text-neutral-400">
                            <Markdown>{agreement}</Markdown>
                        </article>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-px w-full" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-4/5" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-3/4" />
                            </div>
                            <div className="pt-4 text-center">
                                <p className="text-neutral-500 dark:text-neutral-400">{t.noMore}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
