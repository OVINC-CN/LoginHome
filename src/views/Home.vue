<template>
  <a-space
    :fill="true"
    id="home"
  >
    <a-space
      id="home-space"
      direction="vertical"
      v-if="metaConfig.brand_title"
    >
      <h2 id="home-space-title">
        {{ metaConfig.brand_title }}
      </h2>
      <div
        id="home-space-desc"
        v-if="metaConfig.brand_desc"
      >
        {{ metaConfig.brand_desc }}
      </div>
    </a-space>
  </a-space>
  <a-space
    id="home-org"
    direction="vertical"
  >
    <a-space
      id="home-org-content"
      direction="vertical"
    >
      <a-space
        class="home-org-item"
        direction="vertical"
        v-if="metaConfig.brand_vision"
      >
        <a-divider
          orientation="left"
          class="home-org-item-divider"
        >
          <div class="home-org-second-title">
            {{ $t('OrgSpiritTitle') }}
          </div>
        </a-divider>
        <div class="home-org-item-content-font">
          {{ metaConfig.brand_vision }}
        </div>
      </a-space>
      <a-space
        class="home-org-item"
        direction="vertical"
        v-if="apps.length > 0"
      >
        <a-divider
          orientation="left"
          class="home-org-item-divider"
        >
          <div class="home-org-second-title">
            {{ $t('Services') }}
          </div>
        </a-divider>
        <a-space
          :size="[40, 40]"
          direction="vertical"
          style="align-items: flex-start"
        >
          <application-display
            :app="app"
            v-for="app in apps"
            :key="app.app_code"
            class="home-org-item-content-font"
          />
        </a-space>
      </a-space>
      <a-space
        class="home-org-item"
        direction="vertical"
        v-if="metaConfig.contact_picture_url || metaConfig.contact_email || metaConfig.contact_phone"
      >
        <a-divider
          orientation="left"
          class="home-org-item-divider"
        >
          <div class="home-org-second-title">
            {{ $t('ContactWays') }}
          </div>
        </a-divider>
        <div class="home-org-item-contact-us">
          <img
            v-if="metaConfig.contact_picture_url"
            alt="wechat_mp"
            :src="metaConfig.contact_picture_url"
            class="home-org-item-content-img"
          >
          <div
            style="display: flex; align-items: center; justify-content: center"
            v-if="metaConfig.contact_email || metaConfig.contact_phone"
          >
            <img
              alt="mail"
              src="/public/extra-assets/img/undraw_mailbox_re_dvds.svg"
              class="home-org-item-content-img"
              style="max-height: 120px; margin-right: 40px"
            >
            <div style="font-size: 16px; line-height: 18px">
              {{ $t('Email') }}:
              <br>
              <a-link
                :href="`mailto:${metaConfig.contact_email}`"
                style="padding: 0; font-size: 16px; color: unset"
              >
                {{ metaConfig.contact_email }}
              </a-link>
              <template v-if="metaConfig.contact_phone">
                <br>
                {{ $t('PhoneNumber') }}: {{ metaConfig.contact_phone }}
              </template>
            </div>
          </div>
        </div>
      </a-space>
    </a-space>
  </a-space>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import ApplicationDisplay from '../components/ApplicationDisplay.vue';
import {listAllAppAPI} from '../api/app';
import {useStore} from 'vuex';

const apps = ref([]);
const loadApps = () => {
  listAllAppAPI().then((res) => apps.value = res.data);
};
onMounted(() => loadApps());

const store = useStore();
const metaConfig = computed(() => store.state.metaConfig);
</script>

<style scoped>
#home {
  margin-top: -90px;
  height: calc(100 * var(--vh));
  width: 100%;
  justify-content: center;
  align-items: center;
  background-image: url('/extra-assets/img/bg-1.webp?imageMogr2/thumbnail/1920x1080/format/webp/interlace/1');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#home-space {
  box-shadow: var(--shadow2-center);
  padding: 60px 80px;
  align-items: center;
  border-radius: var(--border-radius-medium);
  background: rgba(255, 255, 255, 0.4);
}

#home-org-content {
  max-width: 1440px;
  width: 100%;
}

#home-space-title {
  font-size: 24px;
  margin-top: 0;
  color: var(--color-neutral-10);
}

#home-space-desc {
  font-size: 18px;
  color: var(--color-neutral-8);
}

#home-org {
  padding: 60px;
  width: 100%;
  box-sizing: border-box;
}

#home-org > :deep(.arco-space-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.home-org-item {
  align-items: center;
  width: 100%;
}

.home-org-item > :deep(.arco-space-item) {
  width: 100%;
}

.home-org-second-title {
  width: 100%;
  font-size: 1.6em;
  font-weight: bold;
}

.home-org-item-divider {
  margin: 100px 0 60px 0 !important;
}

.home-org-item-content-font {
  font-size: 16px;
  color: var(--color-neutral-10);
  line-height: 32px;
}

.home-org-item-content-img {
  max-width: 480px;
  width: 100%;
  object-fit: contain;
}

.home-org-item-contact-us {
  display: flex;
  justify-content: space-around;
}

@media screen and (max-width: 600px) {
  #home-space {
    padding: 60px 40px;
  }
  #home-org {
    padding: 20px;
  }
}

@media screen and (max-width: 1000px) {
  .home-org-item-contact-us {
    flex-direction: column;
    align-items: center;
  }
  .home-org-item-contact-us > img {
    margin-bottom: 40px;
  }
  .home-org-item-divider {
    margin: 60px 0 60px 0 !important;
  }
}
</style>
