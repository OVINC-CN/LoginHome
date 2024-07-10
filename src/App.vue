<template>
  <a-config-provider :locale="locale">
    <a-spin
      :size="32"
      :loading="mainLoading"
      :tip="$t('loading')"
    >
      <a-layout id="app-layout">
        <a-layout-header id="app-header">
          <div>
            <a-menu
              mode="horizontal"
              :default-selected-keys="[currentMenuItem]"
              @menu-item-click="goTo"
            >
              <a-menu-item
                disabled
                id="app-menu-logo"
                v-if="metaConfig.logo_url"
              >
                <div>
                  <img
                    :src="metaConfig.logo_url"
                    alt="home page logo"
                  >
                </div>
              </a-menu-item>
              <a-menu-item
                v-for="item in menu"
                :key="item.key"
              >
                {{ item.name }}
              </a-menu-item>
            </a-menu>
            <a-space id="app-header-right">
              <a-dropdown @select="changeLangAndReload">
                <icon-public id="app-header-menu-lang" />
                <template #content>
                  <a-doption
                    v-for="item in langOption"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-doption>
                </template>
              </a-dropdown>
              <!--<user-avatar />-->
            </a-space>
          </div>
        </a-layout-header>
        <a-layout-content>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </a-layout-content>
        <a-layout-footer id="app-footer">
          <div v-if="metaConfig.contact_place">
            {{ $t('WorkPlace') }}&nbsp;-&nbsp;<span>{{ metaConfig.contact_place }}</span>
          </div>
          <div>
            Copyright&nbsp;&copy;&nbsp;{{ currentYear }}&nbsp;
            <span>{{ metaConfig.copyright }}</span>
          </div>
          <div class="beian-info">
            <a
              id="miit-filling"
              :href="metaConfig.miit_filling_url"
              v-if="metaConfig.miit_filling_code"
              target="_blank"
            >
              {{ metaConfig.miit_filling_code }}
            </a>
            <a
              v-if="metaConfig.gongan_filling_id"
              id="gongan-filling"
              target="_blank"
              :href="metaConfig.gongan_filling_url"
            >
              <img
                src="/extra-assets/img/beian.png"
                alt="beian.png"
                style="
                  display: inline-block;
                  text-decoration: none;
                  vertical-align: text-bottom;
                  width: 16px;
                  height: 16px;
                  margin: 0 0 0 10px;
                "
              >
              {{ metaConfig.gongan_filling_id }}
            </a>
          </div>
        </a-layout-footer>
      </a-layout>
    </a-spin>
  </a-config-provider>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useStore} from 'vuex';
import {locale, langOption, changeLangAndReload} from './locale';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import Aegis from 'aegis-web-sdk';
import {getRUMConfigAPI} from './api/trace';

// locale
const i18n = useI18n();

// store
const store = useStore();
const mainLoading = computed(() => store.state.mainLoading);
const metaConfig = computed(() => store.state.metaConfig);

// title
const title = computed(() => {
  if (metaConfig.value.website_title) {
    return i18n.t('Portal') + ' | ' + metaConfig.value.website_title;
  }
  return i18n.t('Portal');
});
watch(() => title.value, () => {
  document.title = title.value;
});

// menu
const menu = ref([
  {
    key: 'Home',
    name: i18n.t('Home'),
    path_match: '/',
  },
]);
const router = useRouter();
const currentMenuItem = ref(menu.value[0].key);
const goTo = (key) => {
  router.push({name: key});
};
menu.value.forEach((item, index) => {
  if (index === 0) return;
  if (window.location.pathname.startsWith(item.path_match)) currentMenuItem.value = item.key;
});

// footer
const currentYear = ref(new Date().getFullYear());

// aegis
const initRUM = () => {
  getRUMConfigAPI()
      .then((res) => {
        if (res.data.id) {
          new Aegis(res.data);
        }
      });
};
onMounted(() => {
  store.dispatch('loadMetaConfig').then(
      () => initRUM(),
  ).finally(
      () => store.dispatch('setMainLoading', false),
  );
});
</script>

<style>
@import 'App.css';

#app-layout {
  height: calc(100 * var(--vh));
  width: 100vw;
}

#app-header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border-1);
}

#app-header > div {
  display: flex;
  justify-content: space-around;
}

#app-header-right {
  display: flex;
  align-items: center;
  padding: 14px 20px 14px 0;
  z-index: 1;
}

#app-menu-logo {
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  background-color: unset;
}

#app-header-menu-lang {
  cursor: pointer;
  margin-right: 12px;
}

#app-menu-logo > div {
  display: flex;
  align-items: center;
}

#app-menu-logo > div > img {
  height: 36px;
  padding-right: 4px;
  color: var(--color-text-1);
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}

#app-footer {
  z-index: 1;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--color-border-1);
  color: var(--color-text-1);
  margin-top: 20px;
  flex-direction: column;
  padding: 10px;
  line-height: 24px;
  word-break: keep-all;
}

#miit-filling,
#gongan-filling {
  text-decoration: none;
  color: unset;
}

.beian-info {
  display: flex;
}

@media screen and (max-width: 400px) {
  .beian-info {
    flex-direction: column;
  }
}

#app-header .arco-menu-item {
  background-color: unset;
}
</style>
