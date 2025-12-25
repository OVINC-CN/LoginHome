import http from '@/api/index';

export interface App {
  app_code: string;
  app_name: string;
  app_logo: string;
  app_url: string;
  app_desc: string;
  managers: string[];
}

export const listAllAppAPI = (): Promise<App[]> => http.get('/application/all/');
