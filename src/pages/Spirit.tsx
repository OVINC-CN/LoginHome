import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import { Skeleton } from '@/components/ui/skeleton';

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

export function Spirit() {
    const { t } = useTranslations();
    const metaConfig = useAppStore((state) => state.metaConfig);

    const visionContent = useMemo(() => {
        return parseTextContent(metaConfig.brand_vision || '');
    }, [metaConfig.brand_vision]);

    const hasContent = metaConfig.brand_vision;

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
            {/* Hero Header */}
            <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50 py-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100 blur-3xl dark:bg-blue-900/20" />
                    <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-100 blur-3xl dark:bg-purple-900/20" />
                </div>
                <div className="relative mx-auto max-w-[1280px] px-6 text-center">
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl lg:text-3xl">
                        {t.SpiritAndVision}
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                        {t.SpiritAndVisionDesc}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="flex-1 px-6 py-6 md:py-6">
                <div className="mx-auto w-full max-w-[1280px]">
                    {hasContent ? (
                        <div className="lg:grid-cols-2">
                            {metaConfig.brand_vision && (
                                <div className="group rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 transition-all hover:shadow-lg dark:from-purple-950/30 dark:to-pink-950/30 md:p-10">
                                    <div className="space-y-4">
                                        {visionContent.paragraphs.map((paragraph, pIndex) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <p key={pIndex} className="text-base leading-8 text-neutral-700 dark:text-neutral-300">
                                                {paragraph.map((sentence, sIndex) => (
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <span key={sIndex}>
                                                        {sentence}
                                                        {sIndex < paragraph.length - 1 && ' '}
                                                    </span>
                                                ))}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="rounded-3xl bg-neutral-50 p-10 dark:bg-neutral-900">
                                <Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
                                <Skeleton className="mb-6 h-8 w-32" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-4/5" />
                                    <Skeleton className="h-6 w-3/4" />
                                </div>
                            </div>
                            <div className="rounded-3xl bg-neutral-50 p-10 dark:bg-neutral-900">
                                <Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
                                <Skeleton className="mb-6 h-8 w-32" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-4/5" />
                                    <Skeleton className="h-6 w-3/4" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
