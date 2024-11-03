<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import ApplicationDisplay from '@/components/ApplicationDisplay.vue';
import {listAllAppAPI} from '@/api/app';

const apps = ref([]);
const loadApps = () => {
  listAllAppAPI().then((res) => apps.value = res.data);
};
onMounted(() => loadApps());

const windowWidth = ref(window.innerWidth);
onMounted(() => window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
}));
onUnmounted(() => window.removeEventListener('resize', () => {}));
const cardSpan = computed(() => {
  if (windowWidth.value >= 900) {
    return 24 / 3;
  }
  if (windowWidth.value >= 600) {
    return 24 / 2;
  }
  return 24;
});
</script>

<template>
  <a-layout id="services">
    <a-layout-header>
      {{ $t('ApplicationAndServices') }}
    </a-layout-header>
    <a-layout-content>
      <div>
        <a-row
          v-if="apps.length > 0"
          class="services-row"
          :gutter="[20, 20]"
          wrap
          justify="center"
        >
          <a-col
            :span="cardSpan"
            v-for="app in apps"
            :key="app.app_code"
          >
            <application-display
              :app="app"
              class="home-org-item-content-font"
            />
          </a-col>
        </a-row>
        <a-empty v-else />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
#services {
  display: flex;
  justify-content: center;
  height: 100%;
}

#services .arco-layout-header {
  width: 100%;
  height: 240px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/extra-assets/img/bg-2.webp");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

@media (min-height: 800px) {
  #services .arco-layout-header {
    height: 320px;
  }
}

#services .arco-layout-content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.arco-layout-content > div {
  max-width: 1600px;
  width: 100%;
}

.services-row  {
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
}
</style>
