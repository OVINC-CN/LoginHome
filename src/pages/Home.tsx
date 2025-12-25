import { useState } from 'react';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import { Mail, Phone, RotateCcw } from 'lucide-react';

interface FlipCardProps {
  isFlipped: boolean;
  onFlip: () => void;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
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

export function Home() {
  const { t } = useTranslations();
  const metaConfig = useAppStore((state) => state.metaConfig);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden">
        {/* Grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 blur-3xl" />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
        {/* Content */}
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

      {/* Contact Section */}
      {(metaConfig.contact_picture_url || metaConfig.contact_email || metaConfig.contact_phone) && (
        <section className="border-t border-neutral-200 bg-neutral-50/50 py-20 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="mx-auto w-full max-w-5xl px-6">
            <h2 className="mb-4 text-center text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-2xl">
              {t.ContactWays}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-neutral-500 dark:text-neutral-400">
              {t.ContactUsDesc}
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* QR Code Card */}
              {metaConfig.contact_picture_url && (
                <FlipCard
                  isFlipped={!!flippedCards['qrcode']}
                  onFlip={() => toggleFlip('qrcode')}
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
              {/* Email Card */}
              {metaConfig.contact_email && (
                <FlipCard
                  isFlipped={!!flippedCards['email']}
                  onFlip={() => toggleFlip('email')}
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
              {/* Phone Card */}
              {metaConfig.contact_phone && (
                <FlipCard
                  isFlipped={!!flippedCards['phone']}
                  onFlip={() => toggleFlip('phone')}
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
