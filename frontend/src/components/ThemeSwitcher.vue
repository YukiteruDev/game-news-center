<script setup lang="ts">
import { usePreferredColorScheme, useLocalStorage } from '@vueuse/core';
import type { Theme } from '../types';
import { onMounted, ref, watch } from 'vue';

const storedTheme = useLocalStorage<Theme>('theme', 'system');

const preferredColorScheme = usePreferredColorScheme();

const selectedTheme = ref<Theme>(storedTheme.value);

watch(selectedTheme, (newTheme) => {
  storedTheme.value = newTheme;
  applyTheme(newTheme);
});

watch(preferredColorScheme, () => {
  if (selectedTheme.value === 'system') {
    applyTheme('system');
  }
});

onMounted(() => {
  applyTheme(selectedTheme.value);
});

function applyTheme(theme: Theme) {
  let themeToApply: string = theme;

  if (theme === 'system') {
    themeToApply = preferredColorScheme.value === 'dark' ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', themeToApply);
}
</script>

<template>
  <div class="theme-switcher">
    <select v-model="selectedTheme">
      <option value="system">跟随系统</option>
      <option value="light">浅色</option>
      <option value="dark">深色</option>
    </select>
  </div>
</template>
