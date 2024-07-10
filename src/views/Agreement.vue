<script setup>
import {useRoute} from 'vue-router';
import {computed} from 'vue';
import {marked} from 'marked';
import {useStore} from 'vuex';
import {useI18n} from 'vue-i18n';

const route = useRoute();
const type = computed(() => route.params.type);
const store = useStore();
const i18n = useI18n();

const userAgreement = computed(() => {
  return marked(store.state.metaConfig.user_agreement ? store.state.metaConfig.user_agreement: i18n.t('No More'));
});

const privacyAgreement = computed(() => {
  return marked(store.state.metaConfig.privacy_agreement ? store.state.metaConfig.privacy_agreement: i18n.t('No More'));
});
const agreement = computed(() => type.value === 'user' ? userAgreement.value: privacyAgreement.value);
</script>

<template>
  <a-space
    id="agreement"
    direction="vertical"
  >
    <h2>
      {{ type === 'user' ? $t('UserAgreement') : $t('PrivacyAgreement') }}
    </h2>
    <div
      v-html="agreement"
      style="text-align: left"
    />
  </a-space>
</template>

<style scoped>
#agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

#agreement > :deep(.arco-space-item) {
  width: 100%;
}

#agreement > :deep(.arco-space-item) > h2,
#agreement > :deep(.arco-space-item) > div {
  text-align: center;
  margin: unset;
}
</style>
