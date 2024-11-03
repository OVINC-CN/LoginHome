<script setup>
import {useStore} from 'vuex';
import {computed} from 'vue';

const store = useStore();
const metaConfig = computed(() => store.state.metaConfig);
</script>

<template>
  <a-layout id="spirit">
    <a-layout-header>
      {{ $t('SpiritAndVision') }}
    </a-layout-header>
    <a-layout-content>
      <div>
        <div
          class="home-org-item-content-font"
          v-if="metaConfig.brand_vision"
        >
          {{ metaConfig.brand_vision }}
        </div>
        <a-empty v-else />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
#spirit {
  display: flex;
  justify-content: center;
}

#spirit .arco-layout-header {
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

#spirit .arco-layout-content {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.arco-layout-content > div {
  max-width: 1600px;
  width: 100%;
}

.home-org-item-content-font {
  font-size: 16px;
  color: var(--color-neutral-10);
  line-height: 36px;
}
</style>
