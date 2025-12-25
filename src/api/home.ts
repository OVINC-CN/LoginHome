import http from '@/api/index';

export interface MetaConfig {
  logo_url: string;
  website_title: string;
  brand_name: string;
  brand_title: string;
  brand_desc: string;
  brand_vision: string;
  user_agreement: string;
  privacy_agreement: string;
  contact_picture_url: string;
  contact_email: string;
  contact_phone: string;
  contact_place: string;
  miit_filling_code: string;
  miit_filling_url: string;
  gongan_filling_id: string;
  gongan_filling_url: string;
  background_image: string;
  copyright: string;
  registry_locked: boolean;
}

export const changeLangAPI = (language: string): Promise<void> => http.post('/i18n/', { language });

export const listMetaConfigAPI = (): Promise<MetaConfig> => http.get('/meta/');
