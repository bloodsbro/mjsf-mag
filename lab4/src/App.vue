<script setup lang="ts">
import { useBreakpoints } from './composables/useBreakpoints'

const {
  width,
  isMobile,
  isTablet,
  isDesktop,
  greater,
  smaller,
  between,
} = useBreakpoints({ mobile: 640, tablet: 960, desktop: 1280 })
</script>

<template>
  <div class="p-4">
    <p>📏 Ширина вікна: {{ width }}px</p>

    <p v-if="isMobile">📱 Мобільний</p>
    <p v-else-if="isTablet">📟 Планшет</p>
    <p v-else-if="isDesktop">🖥 Десктоп</p>

    <hr class="my-4" />

    <p>greater("tablet") → {{ greater('tablet') }}</p>
    <p>smaller("desktop") → {{ smaller('desktop') }}</p>
    <p>between("mobile", "desktop") → {{ between('mobile','desktop') }}</p>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
