<script setup lang="ts">
import AppTitle from './components/AppTitle.vue';
import NewsSourceTabs from './components/NewsSourceTabs.vue';
</script>

<template>
  <main>
    <AppTitle title="Game News Center" />
    <NewsSourceTabs initial-source="all" />
  </main>
</template>

<style scoped></style>
