import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';

export function Footer() {
  const { t } = useTranslations();
  const metaConfig = useAppStore((state) => state.metaConfig);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
        {metaConfig.contact_place && (
          <div className="mb-2">
            {t.WorkPlace}&nbsp;-&nbsp;<span>{metaConfig.contact_place}</span>
          </div>
        )}
        <div className="mb-2">
          Copyright&nbsp;&copy;&nbsp;{currentYear}&nbsp;
          <span dangerouslySetInnerHTML={{ __html: metaConfig.copyright }} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {metaConfig.miit_filling_code && (
            <a
              href={metaConfig.miit_filling_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {metaConfig.miit_filling_code}
            </a>
          )}
          {metaConfig.gongan_filling_id && (
            <a
              href={metaConfig.gongan_filling_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <img
                src="/extra-assets/img/beian.png"
                alt="beian"
                className="inline-block h-4 w-4"
              />
              {metaConfig.gongan_filling_id}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
