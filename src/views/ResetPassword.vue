<template>
  <a-space
    id="reset-password"
    align="center"
    direction="vertical"
  >
    <reset-password />
  </a-space>
</template>

<script setup>
import ResetPassword from '@/components/ResetPassword.vue';
</script>

<style scoped>
#reset-password {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
