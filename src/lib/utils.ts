import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type EnterpriseConfig = Record<string, string[]>;

export function parseEnterpriseConfig(text: string): EnterpriseConfig {
    if (!text.trim()) {
        return {};
    }

    try {
        const parsed: unknown = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return {};
        }

        return Object.entries(parsed).reduce<EnterpriseConfig>((config, [key, value]) => {
            if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
                config[key] = value;
            }

            return config;
        }, {});
    } catch {
        return {};
    }
}
