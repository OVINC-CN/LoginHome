import http from '@/api/index';

export interface RUMConfig {
  id?: string;
  [key: string]: unknown;
}

export const getRUMConfigAPI = (): Promise<RUMConfig> => http.get('/trace/rum/config/');
