import http from '@/api/index';

export interface UserInfo {
  username: string;
  nick_name: string;
  last_login: string;
  user_type: string;
}

export interface SignInParams {
  username: string;
  password: string;
  is_oauth?: boolean;
  wechat_code?: string;
  tcaptcha?: object;
}

export interface SignInResponse {
  code: string;
}

export interface SignUpParams {
  username: string;
  nick_name: string;
  password: string;
  password2: string;
  phone_area: string;
  phone_number: string;
  phone_verify: string;
  is_oauth?: boolean;
  wechat_code?: string;
  tcaptcha?: object;
}

export interface SignUpResponse {
  code: string;
}

export interface ResetPasswordParams {
  username: string;
  password: string;
  password2: string;
  phone_area: string;
  phone_number: string;
  phone_verify: string;
  tcaptcha?: object;
}

export interface WeChatLoginResponse {
  code?: string;
  wechat_code?: string;
}

export interface PhoneArea {
  value: string;
  label: string;
}

export const getUserInfoAPI = (): Promise<UserInfo> => http.get('/account/user_info/');

export const signInAPI = (data: SignInParams): Promise<SignInResponse> => http.post('/account/sign_in/', data);

export const signUpAPI = (data: SignUpParams): Promise<SignUpResponse> => http.post('/account/sign_up/', data);

export const sendVerifyCodeAPI = (data: { phone_area: string; phone_number: string; tcaptcha?: object }): Promise<void> =>
    http.post('/account/phone_verify_code/', data);

export const signOutAPI = (): Promise<void> => http.get('/account/sign_out/');

export const oauthCodeAPI = (): Promise<SignInResponse> => http.get('/account/oauth_code/');

export const getWeChatConfigAPI = (): Promise<{ app_id?: string; state?: string; is_wechat?: boolean }> => http.get('/account/wechat_config/');

export const weChatLoginAPI = (data: { code: string; state: string; is_oauth: boolean }): Promise<WeChatLoginResponse> =>
    http.post('/account/wechat_login/', data);

export const resetPasswordAPI = (data: ResetPasswordParams): Promise<void> => http.post('/account/reset_password/', data);

export const getPhoneAreasAPI = (): Promise<PhoneArea[]> => http.get('/account/phone_areas/');
