import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import Markdown from 'react-markdown';
import { Shield, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function Agreement() {
  const { type } = useParams<{ type: string }>();
  const { t } = useTranslations();
  const metaConfig = useAppStore((state) => state.metaConfig);

  const agreement = type === 'user' ? metaConfig.user_agreement : metaConfig.privacy_agreement;
  const title = type === 'user' ? t.UserAgreement : t.PrivacyAgreement;
  const Icon = type === 'user' ? FileText : Shield;
  const iconColor = type === 'user' ? 'bg-blue-600' : 'bg-green-600';
  const iconShadow = type === 'user' ? 'shadow-blue-600/30' : 'shadow-green-600/30';

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-neutral-50/50 dark:bg-neutral-950">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-blue-100 blur-3xl dark:bg-blue-900/20" />
          <div className="absolute right-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-purple-100 blur-3xl dark:bg-purple-900/20" />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-6 text-center">
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${iconColor} shadow-lg ${iconShadow}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
            {type === 'user' ? t.UserAgreementDesc : t.PrivacyAgreementDesc}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 px-6 py-6">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900 md:p-12">
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
        </div>
      </section>
    </div>
  );
}
