<script setup lang="ts">
defineProps<{ title: string }>();

function reloadPage() {
  location.reload();
}
</script>

<template>
  <h1>
    <a href="#" @click.prevent="reloadPage">游戏资讯中心</a>
  </h1>
</template>

<style scoped>
h1 {
  font-size: 1.2em;
  line-height: 1.1;

  a {
    color: var(--text-color);
    text-decoration: none;
  }
}
</style>
