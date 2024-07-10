<template>
  <a-space
    id="reset-password-box"
    direction="vertical"
  >
    <div id="reset-password-box-title-box">
      <h2 id="reset-password-box-title">
        {{ $t('ResetPassword') }}
      </h2>
    </div>
    <a-form
      class="reset-password-box-form"
      ref="resetPasswordFormRef"
      :model="resetData"
      @submit="handleSubmit"
      auto-label-width
    >
      <a-form-item
        field="username"
        :label="$t('Username')"
        :rules="resetRules.username"
        feedback
      >
        <a-input
          v-model="resetData.username"
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
        field="password"
        :label="$t('newPassword')"
        :rules="resetRules.password"
        feedback
      >
        <a-input-password
          v-model="resetData.password"
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
        :label="$t('newPassword')"
        :rules="resetRules.password2"
        feedback
      >
        <a-input-password
          v-model="resetData.password2"
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
        :rules="resetRules.phoneArea"
        feedback
      >
        <a-select
          v-model="resetData.phone_area"
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
        :rules="resetRules.phoneNumber"
        feedback
      >
        <a-input
          v-model="resetData.phone_number"
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
        :rules="resetRules.phoneVerify"
        feedback
      >
        <a-input
          v-model="resetData.phone_verify"
          :disabled="loading || resetData.phone_number.length <= 0"
          :placeholder="$t('PhoneVerifyCode')"
          allow-clear
        >
          <template #prefix>
            <icon-safe />
          </template>
        </a-input>
        <a-button
          type="primary"
          :disabled="resetData.phone_number.length <= 0 || waitTime > 0"
          @click="sendVerifyCode"
        >
          {{ waitTime > 0 ? `${waitTime}s` : i18n.t('SendVerifyCode') }}
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            @click="$refs.resetPasswordFormRef.resetFields()"
            :loading="loading"
          >
            {{ $t('Clear') }}
          </a-button>
          <a-button
            html-type="submit"
            type="primary"
            :loading="loading"
          >
            {{ $t('Submit') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-space>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {handleLoading} from '../utils/loading';
import {getPhoneAreasAPI, resetPasswordAPI, sendVerifyCodeAPI} from '../api/user';
import {Message, Modal} from '@arco-design/web-vue';
import {hashPassword} from '../utils/encrypt';
import globalContext from '../context';
import {checkTCaptcha} from '../utils/tcaptcha';

// loading
const loading = ref(false);

// i18n
const i18n = useI18n();

// config
const phoneAreaOptions = ref([]);
onMounted(() => {
  getPhoneAreasAPI().then((res) => (phoneAreaOptions.value = res.data));
});

// form
const resetData = ref({
  username: '',
  password: '',
  password2: '',
  phone_area: '',
  phone_number: '',
  phone_verify: '',
});
const password2Validator = (value, cb) => {
  if (resetData.value.password === resetData.value.password2) return;
  return cb(i18n.t('Password2NotMatch'));
};
const resetRules = ref({
  username: [
    {required: true, message: i18n.t('UsernameRequired')},
    {match: /^[a-zA-Z]{1}[a-zA-Z0-9]{5,}$/, message: i18n.t('UsernameRegexInvalid')},
  ],
  password: [{required: true, message: i18n.t('PasswordRequired')}],
  password2: [{required: true, message: i18n.t('PasswordRequired')}, {validator: password2Validator}],
  phoneArea: [{required: true, message: i18n.t('PhoneAreaRequired')}],
  phoneNumber: [{required: true, message: i18n.t('PhoneNumberRequired')}],
  phoneVerify: [{required: true, message: i18n.t('PhoneVerifyRequired')}],
});

// reset
const handleSubmit = async ({values, errors}) => {
  if (errors) return;
  handleLoading(loading, true);
  const encryptedPassword = await hashPassword(values.password, values.username);
  const encryptedOldPassword = await hashPassword(values.old_password, values.username);
  const params = {
    ...values,
    old_password: encryptedOldPassword,
    password: encryptedPassword,
    password2: encryptedPassword,
  };
  checkTCaptcha((ret) => {
    params.tcaptcha = ret;
    resetPasswordAPI(params)
        .then(
            () => {
              Message.success(i18n.t('ResetPasswordSuccess'));
              window.location.href = globalContext.siteUrl;
            },
            (err) =>
              Modal.warning({
                title: i18n.t('ResetPasswordFailed'),
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
    resetData.value.tcaptcha = ret;
    sendVerifyCodeAPI(resetData.value).then(
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
#reset-password-box {
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-1);
  box-sizing: border-box;
  box-shadow: var(--shadow2-center);
  overflow: hidden;
}

#reset-password-box-title-box {
  background: linear-gradient(-45deg, rgb(var(--arcoblue-4)), rgb(var(--green-2)));
  padding: 32px 20px;
  margin-bottom: 20px;
}

#reset-password-box-title {
  text-align: center;
  margin: 0;
  color: var(--color-white);
}

.reset-password-box-form {
  width: 360px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
