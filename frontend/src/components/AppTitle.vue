<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <h1>{{ title }}</h1>
</template>

<style scoped>
h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
</style>
