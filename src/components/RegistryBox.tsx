import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Phone, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store';
import { useTranslations } from '@/contexts/useTranslations';
import { signUpAPI, sendVerifyCodeAPI, getPhoneAreasAPI } from '@/api/user';
import { getTCaptchaConfigAPI, type TCaptchaConfig } from '@/api/tcaptcha';
import { hashPassword } from '@/lib/encrypt';
import { checkTCaptcha } from '@/lib/tcaptcha';

interface RegistryBoxProps {
  onLoginRedirect: (code: string) => void;
}

export function RegistryBox({ onLoginRedirect }: RegistryBoxProps) {
    const { t } = useTranslations();
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [username, setUsername] = useState('');
    const [nickName, setNickName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phoneArea, setPhoneArea] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneVerify, setPhoneVerify] = useState('');
    const [readAgreement, setReadAgreement] = useState(false);
    const [error, setError] = useState('');
    const [waitTime, setWaitTime] = useState(0);
    const [phoneAreaOptions, setPhoneAreaOptions] = useState<{ value: string; label: string }[]>([]);
    const [tcaptchaConfig, setTcaptchaConfig] = useState<TCaptchaConfig | null>(null);

    const { weChatCode, setWeChatCode, metaConfig } = useAppStore();

    useEffect(() => {
        getPhoneAreasAPI().then((res) => {
            setPhoneAreaOptions(res);
        });
        getTCaptchaConfigAPI()
            .then((config) => setTcaptchaConfig(config))
            .catch(() => setTcaptchaConfig({ is_enabled: false, app_id: '', aid_encrypted: '' }));
    }, []);

    useEffect(() => {
        if (waitTime > 0) {
            const timer = setTimeout(() => setWaitTime(waitTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [waitTime]);

    const handleSendVerifyCode = () => {
        if (!phoneNumber) {
            setError(t.PhoneNumberRequired);
            return;
        }
        setError('');
        setSendingCode(true);

        if (tcaptchaConfig?.is_enabled) {
            checkTCaptcha(async (ret) => {
                if (ret.ret !== 0) {
                    setError(ret.message || '');
                    setSendingCode(false);
                    return;
                }
                try {
                    await sendVerifyCodeAPI({ phone_area: phoneArea, phone_number: phoneNumber, tcaptcha: ret });
                    setWaitTime(60);
                } catch (err) {
                    const errorMessage = (err as { message?: string })?.message || '';
                    setError(errorMessage);
                } finally {
                    setSendingCode(false);
                }
            });
        } else {
            sendVerifyCodeAPI({ phone_area: phoneArea, phone_number: phoneNumber })
                .then(() => setWaitTime(60))
                .catch((err) => {
                    const errorMessage = (err as { message?: string })?.message || '';
                    setError(errorMessage);
                })
                .finally(() => setSendingCode(false));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== password2) {
            setError(t.Password2NotMatch);
            return;
        }
        setLoading(true);
        setError('');

        try {
            const encryptedPassword = await hashPassword(password, username);

            if (tcaptchaConfig?.is_enabled) {
                checkTCaptcha(async (ret) => {
                    if (ret.ret !== 0) {
                        setError(ret.message || t.RegistryFailed);
                        setLoading(false);
                        return;
                    }
                    await doSignUp(encryptedPassword, ret);
                });
            } else {
                await doSignUp(encryptedPassword, { ret: 0 });
            }
        } catch {
            setError(t.RegistryFailed);
            setLoading(false);
        }
    };

    const doSignUp = async (encryptedPassword: string, tcaptchaResult: { ret: number; ticket?: string; randstr?: string }) => {
        try {
            const params = {
                username,
                nick_name: nickName,
                password: encryptedPassword,
                password2: encryptedPassword,
                phone_area: phoneArea,
                phone_number: phoneNumber,
                phone_verify: phoneVerify,
                is_oauth: true,
                tcaptcha: tcaptchaResult,
                ...(weChatCode && { wechat_code: weChatCode }),
            };
            if (weChatCode) {
                setWeChatCode('');
            }
            const res = await signUpAPI(params);
            onLoginRedirect(res.code);
        } catch (err) {
            const errorMessage = (err as { message?: string })?.message || t.RegistryFailed;
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm gap-0 border-neutral-200 py-0 shadow-sm dark:border-neutral-800">
            <CardHeader className="gap-0 border-b border-neutral-100 pb-4 pt-5 dark:border-neutral-800">
                <CardTitle className="text-center text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    <span dangerouslySetInnerHTML={{ __html: metaConfig.brand_name ? `${metaConfig.brand_name}&nbsp;` : '' }} />
                    {t.LoginToOVINC}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-username" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.Username}
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="reg-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                className="h-10 pl-9"
                                placeholder={t.Username}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-nickname" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.NickName}
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="reg-nickname"
                                value={nickName}
                                onChange={(e) => setNickName(e.target.value)}
                                disabled={loading}
                                className="h-10 pl-9"
                                placeholder={t.NickName}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-password" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.Password}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="reg-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="h-10 pl-9"
                                placeholder={t.Password}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-password2" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.repeatPassword}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="reg-password2"
                                type="password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                disabled={loading}
                                className="h-10 pl-9"
                                placeholder={t.repeatPassword}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm text-neutral-600 dark:text-neutral-400">{t.PhoneArea}</Label>
                        <Select value={phoneArea} onValueChange={setPhoneArea} disabled={loading}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder={t.PhoneArea} />
                            </SelectTrigger>
                            <SelectContent>
                                {phoneAreaOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-phone" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.PhoneNumber}
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="reg-phone"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={loading}
                                className="h-10 pl-9"
                                placeholder={t.PhoneNumber}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-verify" className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t.PhoneVerifyCode}
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <Input
                                    id="reg-verify"
                                    value={phoneVerify}
                                    onChange={(e) => setPhoneVerify(e.target.value)}
                                    disabled={loading || !phoneNumber}
                                    className="h-10 pl-9"
                                    placeholder={t.PhoneVerifyCode}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleSendVerifyCode}
                                disabled={!phoneNumber || waitTime > 0 || sendingCode}
                                className="h-10 whitespace-nowrap cursor-pointer"
                            >
                                {sendingCode && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                {waitTime > 0 ? `${waitTime}s` : t.SendVerifyCode}
                            </Button>
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
                                setNickName('');
                                setPassword('');
                                setPassword2('');
                                setPhoneNumber('');
                                setPhoneVerify('');
                            }}
                            disabled={loading}
                            className="h-10 cursor-pointer"
                        >
                            {t.Clear}
                        </Button>
                        <Button type="submit" disabled={loading || !readAgreement} className="h-10 flex-1 cursor-pointer">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {weChatCode ? t.Bind : t.Submit}
                        </Button>
                    </div>
                </form>
                <div className="mt-4 flex items-start gap-2">
                    <Checkbox
                        id="reg-agreement"
                        checked={readAgreement}
                        onCheckedChange={(checked) => setReadAgreement(checked as boolean)}
                        className="mt-0.5"
                    />
                    <label htmlFor="reg-agreement" className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
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
            </CardContent>
        </Card>
    );
}
