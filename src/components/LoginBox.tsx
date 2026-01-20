import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import { signInAPI, oauthCodeAPI, signOutAPI, getWeChatConfigAPI, weChatLoginAPI } from '@/api/user';
import { getTCaptchaConfigAPI, type TCaptchaConfig } from '@/api/tcaptcha';
import { hashPassword } from '@/lib/encrypt';
import { checkTCaptcha } from '@/lib/tcaptcha';
import globalContext from '@/context';

declare global {
  interface Window {
    WxLogin: new (options: {
      self_redirect: boolean;
      id: string;
      appid: string;
      scope: string;
      redirect_uri: string;
      state: string;
      style: string;
      href: string;
    }) => void;
  }
}

interface LoginBoxProps {
  onLoginRedirect: (code: string) => void;
}

// eslint-disable-next-line complexity
export function LoginBox({ onLoginRedirect }: LoginBoxProps) {
    const { t } = useTranslations();
    const [loading, setLoading] = useState(false);
    const [weChatLoading, setWeChatLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [readAgreement, setReadAgreement] = useState(false);
    const [error, setError] = useState('');
    const [useCurrent, setUseCurrent] = useState(false);
    const [useCustom, setUseCustom] = useState(false);
    const [useWeChat, setUseWeChat] = useState(false);
    const [weChatQuickLoginUrl, setWeChatQuickLoginUrl] = useState('');
    const [tcaptchaConfig, setTcaptchaConfig] = useState<TCaptchaConfig | null>(null);
    const [weChatConfigLoaded, setWeChatConfigLoaded] = useState(false);

    const { user, metaConfig, weChatCode, setWeChatCode, isLogin } = useAppStore();

    useEffect(() => {
        getTCaptchaConfigAPI()
            .then((config) => setTcaptchaConfig(config))
            .catch(() => setTcaptchaConfig({ is_enabled: false, app_id: '', aid_encrypted: '' }));
    }, []);

    const initWeChatLogin = useCallback(() => {
        const url = new URL(window.location.href);
        const next = url.searchParams.get('next') || '';
        const redirectURI = `${globalContext.siteUrl}/login/?next=${encodeURIComponent(next)}`;

        getWeChatConfigAPI()
            .then((res) => {
                setWeChatConfigLoaded(true);
                if (res && res.app_id) {
                    if (res.is_wechat) {
                        setWeChatQuickLoginUrl(
                            'https://open.weixin.qq.com/connect/oauth2/authorize' +
                `?appid=${res.app_id}` +
                `&redirect_uri=${encodeURIComponent(redirectURI)}` +
                '&response_type=code' +
                '&scope=snsapi_userinfo' +
                `&state=${res.state}` +
                '#wechat_redirect',
                        );
                    } else {
                        // eslint-disable-next-line no-new
                        new window.WxLogin({
                            self_redirect: false,
                            id: 'wxlogin',
                            appid: res.app_id,
                            scope: 'snsapi_login',
                            redirect_uri: encodeURIComponent(redirectURI),
                            state: res.state || '',
                            style: '',
                            href: `${globalContext.siteUrl}/extra-assets/css/wechat_login.css?v=1718266759`,
                        });
                    }
                }
            })
            .catch(() => {
                setWeChatConfigLoaded(true);
            });
    }, []);

    const checkWeChatLogin = useCallback(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        if (code && state) {
            setWeChatLoading(true);
            weChatLoginAPI({ code, state, is_oauth: true })
                .then((res) => {
                    if ('code' in res && res.code) {
                        onLoginRedirect(res.code);
                    } else if ('wechat_code' in res && res.wechat_code) {
                        setWeChatCode(res.wechat_code);
                        setUseWeChat(false);
                        setWeChatLoading(false);
                    }
                })
                .catch((err) => {
                    const errorMessage = (err as { message?: string })?.message || '';
                    setError(errorMessage);
                    setWeChatLoading(false);
                });
        }
    }, [onLoginRedirect, setWeChatCode]);

    useEffect(() => {
        checkWeChatLogin();
    }, [checkWeChatLogin]);

    useEffect(() => {
        if (useWeChat && !weChatConfigLoaded) {
            initWeChatLogin();
        }
    }, [useWeChat, weChatConfigLoaded, initWeChatLogin]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError(t.UsernameRequired);
            return;
        }
        setLoading(true);
        setError('');

        try {
            const encryptedPassword = await hashPassword(password, username);

            if (tcaptchaConfig?.is_enabled) {
                checkTCaptcha(async (ret) => {
                    if (ret.ret !== 0) {
                        setError(ret.message || t.LoginFailed);
                        setLoading(false);
                        return;
                    }
                    await doSignIn(encryptedPassword, ret);
                });
            } else {
                await doSignIn(encryptedPassword, { ret: 0 });
            }
        } catch {
            setError(t.LoginFailed);
            setLoading(false);
        }
    };

    const doSignIn = async (encryptedPassword: string, tcaptchaResult: { ret: number; ticket?: string; randstr?: string }) => {
        try {
            const params = {
                username,
                password: encryptedPassword,
                is_oauth: true,
                tcaptcha: tcaptchaResult,
                ...(weChatCode && { wechat_code: weChatCode }),
            };
            if (weChatCode) {
                setWeChatCode('');
            }
            const res = await signInAPI(params);
            onLoginRedirect(res.code);
        } catch (err) {
            const errorMessage = (err as { message?: string })?.message || t.LoginFailed;
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleQuickLogin = async () => {
        setLoading(true);
        try {
            const res = await oauthCodeAPI();
            onLoginRedirect(res.code);
        } catch (err) {
            const errorMessage = (err as { message?: string })?.message || t.LoginFailed;
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOutAPI();
            window.location.reload();
        } catch (err) {
            const errorMessage = (err as { message?: string })?.message || '';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchAccount = () => {
        setUseCustom(true);
        setUseCurrent(false);
    };

    const handleWeChatQuickLogin = () => {
        window.location.href = weChatQuickLoginUrl;
    };

    if (isLogin && user.username && !useCustom && !useCurrent) {
        setUseCurrent(true);
    }

    if (useCurrent && user.username) {
        return (
            <Card className="w-full max-w-sm gap-0 border-neutral-200 py-0 shadow-sm dark:border-neutral-800">
                <CardHeader className="gap-0 border-b border-neutral-100 pb-4 pt-5 dark:border-neutral-800">
                    <CardTitle className="text-center text-lg font-medium text-neutral-900 dark:text-neutral-100">
                        <span dangerouslySetInnerHTML={{ __html: metaConfig.brand_name ? `${metaConfig.brand_name}&nbsp;` : '' }} />
                        {t.LoginToOVINC}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 p-5">
                    <p className="mb-0 text-sm text-neutral-500 dark:text-neutral-400">{t.WelcomeBack}</p>
                    <Button onClick={handleQuickLogin} disabled={loading} className="h-10 w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <span dangerouslySetInnerHTML={{ __html: `${t.LoginAs}&nbsp;${user.nick_name}&nbsp;${t.LoginAsEnd}` }} />
                    </Button>
                    <div className="flex gap-3 text-sm">
                        <Button variant="link" size="sm" onClick={handleSwitchAccount} disabled={loading} className="h-auto p-0 text-neutral-500">
                            {t.loginAsAnother}
                        </Button>
                        <Button variant="link" size="sm" onClick={handleLogout} disabled={loading} className="h-auto p-0 text-orange-500">
                            {t.logout}
                        </Button>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
            </Card>
        );
    }

    if (useWeChat && !weChatCode) {
        return (
            <Card className="w-full max-w-sm gap-0 border-neutral-200 py-0 shadow-sm dark:border-neutral-800">
                <CardHeader className="gap-0 border-b border-neutral-100 pb-4 pt-5 dark:border-neutral-800">
                    <CardTitle className="text-center text-lg font-medium text-neutral-900 dark:text-neutral-100">
                        <span dangerouslySetInnerHTML={{ __html: metaConfig.brand_name ? `${metaConfig.brand_name}&nbsp;` : '' }} />
                        {t.LoginToOVINC}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 p-5">
                    {weChatLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        </div>
                    ) : weChatQuickLoginUrl ? (
                        <Button onClick={handleWeChatQuickLogin} className="h-10 w-full bg-green-600 hover:bg-green-700">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {t.WeChatQuickLogin}
                        </Button>
                    ) : (
                        <div id="wxlogin" className="flex min-h-[180px] items-center justify-center" />
                    )}

                    <Separator />

                    <Button variant="link" size="sm" onClick={() => setUseWeChat(false)} className="h-auto p-0 text-neutral-500">
                        {t.UserPassLogin}
                    </Button>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-sm gap-0 border-neutral-200 py-0 shadow-sm dark:border-neutral-800">
            <CardHeader className="gap-0 border-b border-neutral-100 pb-4 pt-5 dark:border-neutral-800">
                <CardTitle className="text-center text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    <span dangerouslySetInnerHTML={{ __html: metaConfig.brand_name ? `${metaConfig.brand_name}&nbsp;` : '' }} />
                    {t.LoginToOVINC}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="username" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.Username}
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading || weChatLoading}
                                className="h-10 pl-9"
                                placeholder={t.Username}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.Password}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || weChatLoading}
                                className="h-10 pl-9"
                                placeholder={t.Password}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setUsername('');
                                setPassword('');
                            }}
                            disabled={loading || weChatLoading}
                            className="h-10"
                        >
                            {t.Clear}
                        </Button>
                        <Button type="submit" disabled={loading || weChatLoading || !readAgreement} className="h-10 flex-1">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {weChatCode ? t.Bind : t.Submit}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 flex items-start gap-2">
                    <Checkbox
                        id="agreement"
                        checked={readAgreement}
                        onCheckedChange={(checked) => setReadAgreement(checked as boolean)}
                        className="mt-0.5"
                    />
                    <label htmlFor="agreement" className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {t.alreadyReadAgreement}
                        <Link to="/agreement/user" className="text-blue-600 hover:underline dark:text-blue-400">
                            {t.UserAgreement}
                        </Link>
                        {' & '}
                        <Link to="/agreement/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                            {t.PrivacyAgreement}
                        </Link>
                    </label>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                    <Separator />
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => setUseWeChat(true)}
                        disabled={loading || weChatLoading}
                        className="h-auto p-0 text-green-600 hover:text-green-700"
                    >
                        <MessageCircle className="mr-1.5 h-4 w-4" />
                        {t.WeChatQuickLogin}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
