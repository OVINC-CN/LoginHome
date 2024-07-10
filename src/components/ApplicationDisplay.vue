<template>
  <a-space class="application-display">
    <div>
      <a-avatar
        v-if="props.app.app_logo"
        :size="avatarSize"
        style="background: white"
      >
        <img
          alt="avatar"
          :src="props.app.app_logo"
        >
      </a-avatar>
      <a-avatar
        v-else
        :size="avatarSize"
      >
        {{ props.app.app_code.slice(0, 1) }}
      </a-avatar>
    </div>
    <div class="application-display-app-info">
      <div class="application-display-name">
        <a-link
          :href="props.app.app_url"
          target="_blank"
          style="text-decoration: unset; color: unset"
        >
          {{ props.app.app_name }}&nbsp;
          <span v-if="props.app.app_url"><icon-launch /></span>
        </a-link>
      </div>
      <div class="application-display-desc">
        {{ props.app.app_desc }}
      </div>
    </div>
  </a-space>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  app: {
    type: Object,
    default: () => ({
      app_name: '',
      app_code: '',
      managers: [],
      app_logo: '',
      app_url: '',
      app_desc: '',
    }),
  },
});

const avatarSize = ref(60);
</script>

<style scoped>
.application-display {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.application-display-app-info {
  margin-left: 20px;
}

.application-display-name > a {
  font-size: 18px;
  padding: 0 0 12px 0;
}
</style>
