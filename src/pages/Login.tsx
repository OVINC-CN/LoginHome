import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginBox } from '@/components/LoginBox';
import { RegistryBox } from '@/components/RegistryBox';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import globalContext from '@/context';

function LoginContent() {
    const { t } = useTranslations();
    const [searchParams] = useSearchParams();
    const [showLogin, setShowLogin] = useState(true);
    const { loadUserInfo } = useAppStore();

    const next = searchParams.get('next');

    useEffect(() => {
        loadUserInfo();
    }, [loadUserInfo]);

    const handleLoginRedirect = (code: string) => {
        if (next) {
            window.location.href = next.indexOf('?') !== -1 ? `${next}&code=${code}` : `${next}?code=${code}`;
            return;
        }
        window.location.href = globalContext.siteUrl || '/';
    };

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 px-6 py-10">
            {showLogin ? (
                <LoginBox onLoginRedirect={handleLoginRedirect} onGoToRegistry={() => setShowLogin(false)} />
            ) : (
                <RegistryBox onLoginRedirect={handleLoginRedirect} />
            )}
            {!showLogin && (
                <div className="flex items-center gap-3 text-sm">
                    <Button variant="link" size="sm" onClick={() => setShowLogin(true)} className="h-auto p-0 text-neutral-500 cursor-pointer">
                        {t.backToLogin}
                    </Button>
                </div>
            )}
        </div>
    );
}

export function Login() {
    return (
        <Suspense fallback={<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
