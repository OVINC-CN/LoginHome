<script setup>
import {computed} from 'vue';
import {useStore} from 'vuex';

const store = useStore();
const metaConfig = computed(() => store.state.metaConfig);

const backgroundUrl = computed(() => metaConfig.value.background_image);
const backgroundImage = computed(() => `url('${backgroundUrl.value}?imageMogr2/thumbnail/1920x1080/format/webp/interlace/1')`);
</script>

<template>
  <a-space
    :fill="true"
    id="home"
    :style="{backgroundImage}"
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
  <div
    id="home-org"
    v-if="metaConfig.contact_picture_url || metaConfig.contact_email || metaConfig.contact_phone"
  >
    <div>
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
          width="480px"
        >
        <div
          style="display: flex; align-items: center; justify-content: space-between; width: 400px"
          v-if="metaConfig.contact_email || metaConfig.contact_phone"
        >
          <img
            alt="mail"
            src="/public/extra-assets/img/undraw_mailbox_re_dvds.svg"
            class="home-org-item-content-img"
            height="120px"
            style="max-height: 120px;"
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
    </div>
  </div>
</template>

<style scoped>
#home {
  margin-top: -60px;
  height: calc(100 * var(--vh));
  width: 100%;
  justify-content: center;
  align-items: center;
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
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

#home-org > div {
  width: 100%;
  max-width: 1600px;
}

.home-org-second-title {
  width: 100%;
  font-size: 1.6em;
  font-weight: bold;
}

.home-org-item-contact-us {
  display: flex;
  justify-content: space-around;
}

@media screen and (max-width: 1000px) {
  .home-org-item-contact-us {
    flex-direction: column;
    align-items: center;
  }
  .home-org-item-contact-us > img {
    margin-bottom: 20px;
  }
  .home-org-item-contact-us > div {
    margin-right: unset;
  }
  #home-space {
    padding: 20px;
  }
}

@media screen and (max-width: 500px) {
  .home-org-item-contact-us > img {
    width: 80% !important;
  }
  .home-org-item-contact-us > div {
    width: 70% !important;
  }
  .home-org-item-contact-us > div > img {
    width: 50% !important;
  }
}
</style>
