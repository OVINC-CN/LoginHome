import { getTCaptchaConfigAPI } from '@/api/tcaptcha';

declare global {
  interface Window {
    TencentCaptcha: new (
      appId: string,
      callback: (ret: { ret: number; ticket?: string; randstr?: string; message?: string }) => void,
      options?: { aidEncrypted?: string; userLanguage?: string }
    ) => { show: () => void };
  }
}

export const checkTCaptcha = async (
  callback: (ret: { ret: number; ticket?: string; randstr?: string; message?: string }) => void,
  locale = 'zh-cn'
) => {
  try {
    const captchaConfig = await getTCaptchaConfigAPI();
    if (captchaConfig.is_enabled) {
      try {
        const tCaptchaClient = new window.TencentCaptcha(String(captchaConfig.app_id), callback, {
          aidEncrypted: captchaConfig.aid_encrypted,
          userLanguage: locale,
        });
        tCaptchaClient.show();
      } catch (e) {
        callback({ ret: -1, message: String(e) });
      }
    } else {
      callback({ ret: 0 });
    }
  } catch {
    callback({ ret: -1 });
  }
};
