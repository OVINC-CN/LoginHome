<template>
  <a-space
    id="login-box"
    direction="vertical"
  >
    <div id="login-box-title-box">
      <h2 id="login-box-title">
        {{ (metaConfig.brand_name ? `${metaConfig.brand_name} `: '') + $t('LoginToOVINC') }}
      </h2>
    </div>
    <a-form
      class="login-box-form"
      ref="formRef"
      :model="loginForm"
      @submit="handleSubmit"
      auto-label-width
      v-if="!useCurrent && !useWeChat"
    >
      <a-form-item
        field="username"
        :label="$t('Username')"
        :rules="loginFormRules.username"
        feedback
      >
        <a-input
          v-model="loginForm.username"
          :disabled="loading || weChatLoading"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :label="$t('Password')"
        :rules="loginFormRules.password"
        feedback
      >
        <a-input-password
          v-model="loginForm.password"
          :disabled="loading || weChatLoading"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            @click="$refs.formRef.resetFields()"
            :loading="loading || weChatLoading"
          >
            {{ $t('Clear') }}
          </a-button>
          <a-button
            html-type="submit"
            type="primary"
            :loading="loading || weChatLoading"
            :disabled="!readAgreement"
          >
            {{ wechatCode ? $t('Bind') : $t('Submit') }}
          </a-button>
        </a-space>
      </a-form-item>
      <a-form-item
        id="login-box-third-login"
        style="margin-top: 20px"
        v-if="false"
      >
        <a-button
          shape="circle"
          @click="initWeChatLogin()"
        >
          <icon-wechat style="color: #70b838" />
        </a-button>
      </a-form-item>
    </a-form>
    <a-space
      class="agreement-agree-box"
      v-if="!useCurrent && !useWeChat"
    >
      <a-checkbox v-model="readAgreement" />
      <div>
        {{ $t('alreadyReadAgreement') }}
        <a
          type="text"
          @click="router.push({name: 'Agreement', params: {type: 'user'}})"
        >
          {{ $t('UserAgreement') }}
        </a>
        &
        <a
          type="text"
          @click="router.push({name: 'Agreement', params: {type: 'privacy'}})"
        >
          {{ $t('PrivacyAgreement') }}
        </a>
      </div>
    </a-space>
    <a-space
      id="wxlogin"
      v-if="useWeChat && !useCurrent"
    />
    <div
      style="width: 100%; text-align: center; margin-bottom: 20px"
      v-if="useWeChat && !useCurrent"
    >
      <a-button
        type="text"
        @click="useWeChat = false"
        style="color: unset; text-decoration: underline;"
      >
        {{ $t('UserPassLogin') }}
      </a-button>
    </div>
    <a-space
      v-if="useCurrent"
      direction="vertical"
      class="login-box-form"
      style="align-items: center; justify-content: center; padding-top: 0"
      :size="[0, 0]"
    >
      <a-button
        type="primary"
        @click="quickLogin"
        :loading="loading || weChatLoading"
      >
        {{ $t('LoginAs') }}&nbsp;{{ user.nick_name }}&nbsp;{{ $t('LoginAsEnd') }}
      </a-button>
      <a-button
        type="text"
        @click="
          useCurrent = !useCurrent;
          initWeChatLogin();
        "
        :loading="loading || weChatLoading"
        style="margin-top: 10px"
      >
        {{ $t('loginAsAnother') }}
      </a-button>
    </a-space>
  </a-space>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {getUserInfoAPI, getWeChatConfigAPI, oauthCodeAPI, signInAPI, weChatLoginAPI} from '@/api/user';
import {Message, Modal} from '@arco-design/web-vue';
import {handleLoading} from '@/utils/loading';
import {useStore} from 'vuex';
import globalContext from '@/context';
import {hashPassword} from '@/utils/encrypt';
import {checkTCaptcha} from '@/utils/tcaptcha';
import {useRouter} from 'vue-router';

const router = useRouter();

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
  document.head.appendChild(script);
});

// loading
const loading = ref(false);
const weChatLoading = ref(false);

// emit
const emits = defineEmits(['loginRedirect']);

// locale
const i18n = useI18n();

// form
const loginForm = ref({
  username: '',
  password: '',
  is_oauth: true,
});
const loginFormRules = ref({
  username: [{required: true, message: i18n.t('UsernameRequired')}],
  password: [{required: true, message: i18n.t('PasswordRequired')}],
});
const readAgreement = ref(false);

// login
const handleSubmit = async ({values, errors}) => {
  if (errors) return;
  handleLoading(loading, true);
  const encryptedPassword = await hashPassword(values.password, values.username);
  const params = {...values, password: encryptedPassword};
  if (store.state.weChatCode) {
    params.wechat_code = store.state.weChatCode;
    store.commit('setWeChatCode', '');
  }
  checkTCaptcha((ret) => {
    params.tcaptcha = ret;
    signInAPI(params)
        .then(
            (res) => {
              Message.info(i18n.t('LoginSuccess'));
              emits('loginRedirect', res.data.code);
            },
            (err) =>
              Modal.warning({
                title: i18n.t('LoginFailed'),
                content: err.response.data.message,
                modalStyle: {textAlign: 'center'},
                width: 340,
                okText: i18n.t('OK'),
              }),
        )
        .finally(() => handleLoading(loading, false));
  });
};

// check Login
const store = useStore();
const user = computed(() => store.state.user);
const metaConfig = computed(() => store.state.metaConfig);
const useCurrent = ref(false);
onMounted(() => {
  handleLoading(loading, true);
  initWeChatLogin();
  getUserInfoAPI()
      .then((res) => {
        store.commit('setUser', res.data);
        store.commit('setIsLogin', true);
      })
      .finally(() => {
        const url = new URL(window.location.href);
        if (url.searchParams.has('code') && url.searchParams.has('state')) {
          checkWeChatLogin();
        } else if (user.value.username) {
          useCurrent.value = true;
        }
        handleLoading(loading, false);
      });
});
const quickLogin = () => {
  handleLoading(loading, true);
  oauthCodeAPI()
      .then(
          (res) => {
            Message.info(i18n.t('LoginSuccess'));
            emits('loginRedirect', res.data.code);
          },
          (err) =>
            Modal.warning({
              title: i18n.t('LoginFailed'),
              content: err.response.data.message,
              modalStyle: {textAlign: 'center'},
              width: 340,
              okText: i18n.t('OK'),
            }),
      )
      .finally(() => handleLoading(loading, false));
};

// WeChat
const wechatCode = computed(() => store.state.weChatCode);
const useWeChat = ref(true);
const initWeChatLogin = () => {
  useWeChat.value = true;
  const url = new URL(window.location.href);
  const next = url.searchParams.get('next');
  const redirectURI = `${globalContext.siteUrl}/login/?next=${encodeURIComponent(next)}`;
  getWeChatConfigAPI().then((res) => {
    if (res.data && res.data.app_id) {
      if (res.data.is_wechat) {
        window.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize' +
          `?appid=${res.data.app_id}` +
          `&redirect_uri=${encodeURIComponent(redirectURI)}` +
          '&response_type=code' +
          '&scope=snsapi_userinfo' +
          `&state=${res.data.state}` +
          '#wechat_redirect';
      } else {
        // eslint-disable-next-line no-undef
        new WxLogin({
          self_redirect: false,
          id: 'wxlogin',
          appid: res.data.app_id,
          scope: 'snsapi_login',
          redirect_uri: encodeURIComponent(redirectURI),
          state: res.data.state,
          style: '',
          href: 'https://www.ovinc.cn/extra-assets/css/wechat_login.css?v=1718266759',
        });
      }
    } else {
      useWeChat.value = false;
    }
  });
};
const checkWeChatLogin = () => {
  const url = new URL(window.location.href);
  const params = {
    code: url.searchParams.get('code'),
    state: url.searchParams.get('state'),
    is_oauth: true,
  };
  weChatLoginAPI(params).then(
      (res) => {
        if ('code' in res.data) {
          emits('loginRedirect', res.data.code);
        } else if ('wechat_code' in res.data) {
          store.commit('setWeChatCode', res.data.wechat_code);
          useWeChat.value = false;
        }
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  );
};
</script>

<style scoped>
#login-box {
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-1);
  box-sizing: border-box;
  box-shadow: var(--shadow2-center);
  overflow: hidden;
}

#login-box-title-box {
  background: linear-gradient(-45deg, rgb(var(--arcoblue-4)), rgb(var(--green-2)));
  padding: 32px 20px;
  margin-bottom: 20px;
}

#login-box-title {
  text-align: center;
  margin: 0;
  color: var(--color-white);
}

.login-box-form {
  width: 360px;
  padding: 20px;
  box-sizing: border-box;
}

#wxlogin {
  display: flex;
  align-items: center;
  justify-content: center;
}

#wxlogin :deep(iframe) {
  height: 260px;
}

.agreement-agree-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -20px 0 20px 0;
  width: 100%;
  max-width: 360px;
  padding: 0 20px;
  box-sizing: border-box;
  word-break: break-all;
}

.agreement-agree-box :deep(.arco-space-item) > div > a {
  margin: 0;
  padding: 0;
  color: rgb(var(--arcoblue-6));
  cursor: pointer;
}
</style>
