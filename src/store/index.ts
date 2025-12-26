import { create } from 'zustand';
import { listMetaConfigAPI, type MetaConfig } from '@/api/home';
import { getUserInfoAPI, type UserInfo } from '@/api/user';

interface AppState {
  mainLoading: boolean;
  isLogin: boolean;
  user: UserInfo;
  weChatCode: string;
  metaConfig: MetaConfig;
  setMainLoading: (loading: boolean) => void;
  setUser: (user: UserInfo) => void;
  setIsLogin: (isLogin: boolean) => void;
  setWeChatCode: (code: string) => void;
  setMetaConfig: (config: MetaConfig) => void;
  loadMetaConfig: () => Promise<void>;
  loadUserInfo: () => Promise<void>;
}

const defaultMetaConfig: MetaConfig = {
  logo_url: '',
  website_title: '',
  brand_name: '',
  brand_title: '',
  brand_desc: '',
  brand_vision: '',
  user_agreement: '',
  privacy_agreement: '',
  contact_picture_url: '',
  contact_email: '',
  contact_phone: '',
  contact_place: '',
  miit_filling_code: '',
  miit_filling_url: '',
  gongan_filling_id: '',
  gongan_filling_url: '',
  background_image: '',
  copyright: '',
  registry_locked: true,
};

const defaultUser: UserInfo = {
  username: '',
  nick_name: '',
  last_login: '',
  user_type: '',
};

export const useAppStore = create<AppState>((set) => ({
  mainLoading: true,
  isLogin: false,
  user: defaultUser,
  weChatCode: '',
  metaConfig: defaultMetaConfig,
  setMainLoading: (loading) => {
    if (loading) {
      set({ mainLoading: true });
    } else {
      setTimeout(() => set({ mainLoading: false }), 600);
    }
  },
  setUser: (user) => set({ user }),
  setIsLogin: (isLogin) => set({ isLogin }),
  setWeChatCode: (code) => set({ weChatCode: code }),
  setMetaConfig: (config) => set({ metaConfig: config }),
  loadMetaConfig: async () => {
    try {
      const res = await listMetaConfigAPI();
      set({ metaConfig: res });
    } catch {
      // ignore error
    }
  },
  loadUserInfo: async () => {
    try {
      const res = await getUserInfoAPI();
      set({ user: res, isLogin: true });
    } catch {
      // ignore error
    }
  },
}));
