import { useEffect, useState } from 'react';
import { listAllAppAPI, type App } from '@/api/app';
import { ApplicationDisplay } from '@/components/ApplicationDisplay';
import { useTranslations } from '@/contexts/useTranslations';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers } from 'lucide-react';

export function Services() {
  const { t } = useTranslations();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllAppAPI()
      .then((res) => {
        setApps(res);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-neutral-50/50 dark:bg-neutral-950">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-indigo-100 blur-3xl dark:bg-indigo-900/20" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-100 blur-3xl dark:bg-cyan-900/20" />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl lg:text-3xl">
            {t.ApplicationAndServices}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            {t.ApplicationAndServicesDesc}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 px-6 py-6">
        <div className="mx-auto w-full max-w-[1280px]">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 flex-shrink-0 rounded-2xl" />
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => (
                <ApplicationDisplay key={app.app_code} app={app} />
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
    </div>
  );
}
