<template>
  <a-space
    id="login"
    align="center"
    direction="vertical"
  >
    <login-box
      v-show="showLogin"
      @login-redirect="loginRedirect"
    />
    <registry-box
      v-show="!showLogin"
      @login-redirect="loginRedirect"
    />
    <a-divider
      id="login-bottom-divider"
      orientation="center"
      :margin="40"
    >
      <div style="display: flex">
        <a-button
          v-if="showLogin && !registryLocked"
          type="text"
          @click="handleToggle"
        >
          {{ $t('goToRegistry') }}
        </a-button>
        <a-button
          v-if="!showLogin"
          type="text"
          @click="handleToggle"
        >
          {{ $t('backToLogin') }}
        </a-button>
        <a-button
          v-if="showLogin"
          type="text"
          @click="goToReset"
        >
          {{ $t('goToReset') }}
        </a-button>
      </div>
    </a-divider>
  </a-space>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';
import {computed, ref} from 'vue';
import LoginBox from '@/components/LoginBox.vue';
import RegistryBox from '@/components/RegistryBox.vue';
import globalContext from '@/context';
import {useStore} from 'vuex';

// store
const store = useStore();
const registryLocked = computed(() => Boolean(store.state.metaConfig.registry_locked));

// route
const route = useRoute();
const router = useRouter();
const next = computed(() => route.query.next);

// login & registry
const showLogin = ref(true);
const handleToggle = () => (showLogin.value = !showLogin.value);

// redirect
const loginRedirect = (code) => {
  if (next.value) {
    window.location.href = next.value.indexOf('?') !== -1 ? `${next.value}&code=${code}` : `${next.value}?code=${code}`;
    return;
  }
  window.location.href = globalContext.siteUrl;
};

// reset
const goToReset = () => {
  router.push({name: 'ResetPassword'});
};
</script>

<style scoped>
#login {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

#login-bottom-divider {
  width: 360px;
}
</style>
