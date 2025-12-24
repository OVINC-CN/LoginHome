import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { App } from '@/api/app';

interface ApplicationDisplayProps {
  app: App;
}

export function ApplicationDisplay({ app }: ApplicationDisplayProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-900">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/30 dark:to-purple-950/30" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {app.app_logo ? (
              <Avatar className="h-12 w-12 rounded-2xl shadow-md">
                <AvatarImage src={app.app_logo} alt={app.app_name} className="rounded-2xl object-cover" />
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
                  {app.app_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                <span className="text-lg font-semibold text-white">{app.app_name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{app.app_name}</h3>
              {app.app_url && <span className="text-sm text-neutral-500 dark:text-neutral-400">{new URL(app.app_url).hostname}</span>}
            </div>
          </div>
          {app.app_url && (
            <a
              href={app.app_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-all duration-200 hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:hover:bg-blue-600"
            >
              <ArrowUpRight className="h-5 w-5" />
            </a>
          )}
        </div>
        {app.app_desc && <p className="mt-4 line-clamp-2 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{app.app_desc}</p>}
        {app.app_url && (
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-blue-400">
            <ExternalLink className="h-4 w-4" />
            <span>{new URL(app.app_url).hostname}</span>
          </div>
        )}
      </div>
    </div>
  );
}
