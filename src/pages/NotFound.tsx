import { Wrench } from 'lucide-react';
import { useTranslations } from '@/contexts/useTranslations';

export function NotFound() {
    const { t } = useTranslations();

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
            <Wrench className="h-12 w-12 text-muted-foreground" />
            <p className="text-2xl text-muted-foreground">{t.PageNotExist}</p>
        </div>
    );
}
