import http from '@/api/index';

export interface TCaptchaConfig {
  is_enabled: boolean;
  app_id: string;
  aid_encrypted: string;
}

export const getTCaptchaConfigAPI = (): Promise<TCaptchaConfig> => http.get('/tcaptcha/config/');
