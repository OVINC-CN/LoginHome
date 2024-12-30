<template>
  <a-space
    id="registry-box"
    direction="vertical"
  >
    <div id="registry-box-title-box">
      <h2 id="registry-box-title">
        {{ $t('LoginToOVINC') }}
      </h2>
    </div>
    <a-form
      class="registry-box-form"
      ref="registryFormRef"
      :model="registryData"
      @submit="handleSubmit"
      auto-label-width
    >
      <a-form-item
        field="username"
        :label="$t('Username')"
        :rules="registryRules.username"
        feedback
      >
        <a-input
          v-model="registryData.username"
          :disabled="loading"
          :placeholder="$t('Username')"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="nick_name"
        :label="$t('NickName')"
        :rules="registryRules.nick_name"
        feedback
      >
        <a-input
          v-model="registryData.nick_name"
          :disabled="loading"
          :placeholder="$t('NickName')"
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
        :rules="registryRules.password"
        feedback
      >
        <a-input-password
          v-model="registryData.password"
          :disabled="loading"
          :placeholder="$t('Password')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="password2"
        :label="$t('Password')"
        :rules="registryRules.password2"
        feedback
      >
        <a-input-password
          v-model="registryData.password2"
          :disabled="loading"
          :placeholder="$t('repeatPassword')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="phone_area"
        :label="$t('PhoneArea')"
        :rules="registryRules.phoneArea"
        feedback
      >
        <a-select
          v-model="registryData.phone_area"
          :options="phoneAreaOptions"
          :disabled="loading"
          :placeholder="$t('PhoneArea')"
          :allow-search="true"
        >
          <template #prefix>
            <icon-phone />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="phone_number"
        :label="$t('PhoneNumber')"
        :rules="registryRules.phoneNumber"
        feedback
      >
        <a-input
          v-model="registryData.phone_number"
          :disabled="loading"
          :placeholder="$t('PhoneNumber')"
          allow-clear
        >
          <template #prefix>
            <icon-phone />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="phone_verify"
        :label="$t('PhoneVerifyCode')"
        :rules="registryRules.phoneVerify"
        feedback
      >
        <a-input
          v-model="registryData.phone_verify"
          :disabled="loading || registryData.phone_number.length <= 0"
          :placeholder="$t('PhoneVerifyCode')"
          allow-clear
        >
          <template #prefix>
            <icon-safe />
          </template>
        </a-input>
        <a-button
          type="primary"
          :disabled="registryData.phone_number.length <= 0 || waitTime > 0"
          @click="sendVerifyCode"
        >
          {{ waitTime > 0 ? `${waitTime}s` : i18n.t('SendVerifyCode') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            @click="$refs.registryFormRef.resetFields()"
            :loading="loading"
          >
            {{ $t('Clear') }}
          </a-button>
          <a-button
            html-type="submit"
            type="primary"
            :loading="loading"
            :disabled="!readAgreement"
          >
            {{ wechatCode ? $t('Bind') : $t('Submit') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-space
      class="agreement-agree-box"
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
  </a-space>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {handleLoading} from '@/utils/loading';
import {signUpAPI, sendVerifyCodeAPI, getPhoneAreasAPI} from '@/api/user';
import {Message, Modal} from '@arco-design/web-vue';
import {useStore} from 'vuex';
import {hashPassword} from '@/utils/encrypt';
import {checkTCaptcha} from '@/utils/tcaptcha';
import {useRouter} from 'vue-router';

// route
const router = useRouter();

// loading
const loading = ref(false);

// emit
const emits = defineEmits(['loginRedirect']);

// store
const store = useStore();
const wechatCode = computed(() => store.state.weChatCode);

// i18n
const i18n = useI18n();

// config
const phoneAreaOptions = ref([]);
onMounted(() => {
  getPhoneAreasAPI().then((res) => (phoneAreaOptions.value = res.data));
});

// form
const readAgreement = ref(false);
const registryData = ref({
  username: '',
  nick_name: '',
  password: '',
  password2: '',
  phone_area: '',
  phone_number: '',
  phone_verify: '',
  is_oauth: true,
});
const password2Validator = (value, cb) => {
  if (registryData.value.password === registryData.value.password2) return;
  return cb(i18n.t('Password2NotMatch'));
};
const registryRules = ref({
  username: [
    {required: true, message: i18n.t('UsernameRequired')},
    {match: /^[a-zA-Z]{1}[a-zA-Z0-9]{5,}$/, message: i18n.t('UsernameRegexInvalid')},
  ],
  nick_name: [{required: true, message: i18n.t('NickNameRequired')}],
  password: [{required: true, message: i18n.t('PasswordRequired')}],
  password2: [{required: true, message: i18n.t('PasswordRequired')}, {validator: password2Validator}],
  phoneArea: [{required: true, message: i18n.t('PhoneAreaRequired')}],
  phoneNumber: [{required: true, message: i18n.t('PhoneNumberRequired')}],
  phoneVerify: [{required: true, message: i18n.t('PhoneVerifyRequired')}],
});

// registry
const handleSubmit = async ({values, errors}) => {
  if (errors) return;
  handleLoading(loading, true);
  const encryptedPassword = await hashPassword(values.password, values.username);
  const params = {...values, password: encryptedPassword, password2: encryptedPassword};
  if (store.state.weChatCode) {
    params.wechat_code = store.state.weChatCode;
    store.commit('setWeChatCode', '');
  }
  checkTCaptcha((ret) => {
    params.tcaptcha = ret;
    signUpAPI(params)
        .then(
            () => {
              Message.success(i18n.t('RegistrySuccess'));
              emits('loginRedirect');
            },
            (err) =>
              Modal.warning({
                title: i18n.t('RegistryFailed'),
                content: err.response.data.message,
                modalStyle: {textAlign: 'center'},
                width: 340,
                okText: i18n.t('OK'),
              }),
        )
        .finally(() => handleLoading(loading, false));
  });
};

// verify code
const defaultWaitTime = ref(60);
const waitTime = ref(0);
const checkWaitTime = () => {
  waitTime.value = waitTime.value - 1;
  if (waitTime.value <= 0) {
    waitTime.value = 0;
  } else {
    setTimeout(() => checkWaitTime(), 1000);
  }
};
const sendVerifyCode = () => {
  checkTCaptcha((ret) => {
    registryData.value.tcaptcha = ret;
    sendVerifyCodeAPI(registryData.value).then(
        () => {
          Message.success(i18n.t('VerifyCodeSendSuccess'));
          waitTime.value = defaultWaitTime.value;
          checkWaitTime();
        },
        (err) => Message.error(err.response.data.message),
    );
  });
};
</script>

<style scoped>
#registry-box {
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-1);
  box-sizing: border-box;
  box-shadow: var(--shadow2-center);
  overflow: hidden;
}

#registry-box-title-box {
  background: linear-gradient(-45deg, rgb(var(--arcoblue-4)), rgb(var(--green-2)));
  padding: 32px 20px;
  margin-bottom: 20px;
}

#registry-box-title {
  text-align: center;
  margin: 0;
  color: var(--color-white);
}

.registry-box-form {
  width: 360px;
  padding: 20px;
  box-sizing: border-box;
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
