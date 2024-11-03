import {createStore} from 'vuex';
import {getUserInfoAPI} from '@/api/user';
import {listMetaConfigAPI} from '@/api/home';

const store = createStore({
  state() {
    return {
      mainLoading: true,
      isLogin: false,
      user: {
        username: '',
        nick_name: '',
        last_login: '',
        user_type: '',
      },
      userProperties: {
        avatar: null,
        phone_number: null,
        mail_address: null,
      },
      userPropertiesRaw: [],
      weChatCode: '',
      metaConfig: {
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
      },
    };
  },
  mutations: {
    setMainLoading(state, payload) {
      state.mainLoading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setIsLogin(state, payload) {
      state.isLogin = payload;
    },
    setUserProperty(state, payload) {
      payload.forEach((item) => (state.userProperties[item.property_key] = item.property_val));
    },
    setUserPropertyRaw(state, payload) {
      state.userPropertiesRaw = payload;
    },
    setWeChatCode(state, payload) {
      state.weChatCode = payload;
    },
    setMetaConfig(state, payload) {
      state.metaConfig = payload;
    },
  },
  actions: {
    setMainLoading({commit}, payload) {
      if (payload) {
        commit('setMainLoading', true);
      } else {
        setTimeout(() => {
          commit('setMainLoading', false);
        }, 600);
      }
    },
    getUserInfo({commit}) {
      getUserInfoAPI().then((res) => {
        commit('setUser', res.data);
        commit('setIsLogin', true);
      });
    },
    loadMetaConfig({commit}) {
      listMetaConfigAPI().then(
          (res) => commit('setMetaConfig', res.data),
      );
    },
  },
});

export default store;
