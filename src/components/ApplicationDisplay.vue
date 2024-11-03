<script setup>
import {ref} from 'vue';

defineProps({
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

const avatarSize = ref(24);


</script>

<template>
  <a-card>
    <template #title>
      <a-space>
        <a-avatar
          v-if="app.app_logo"
          :size="avatarSize"
          style="background: white"
        >
          <img
            alt="avatar"
            :src="app.app_logo"
          >
        </a-avatar>
        <div class="app-name">
          {{ app.app_name }}
        </div>
      </a-space>
    </template>
    <template
      #extra
      v-if="app.app_url"
    >
      <a-link
        :href="app.app_url"
        target="_blank"
      >
        <icon-share-internal />
      </a-link>
    </template>
    <div class="application-display-desc">
      {{ app.app_desc }}
    </div>
  </a-card>
</template>

<style scoped>
.app-name {
  font-weight: bold;
  font-size: 18px;
}

.application-display-desc {
  line-height: 24px;
}
</style>
