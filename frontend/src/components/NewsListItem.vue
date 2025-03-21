<script setup lang="ts">
import { type NewsItem } from '#shared/types/news';
const props = defineProps<{
  item: NewsItem;
}>();
</script>

<template>
  <article>
    <h3>{{ props.item.title }}</h3>
  </article>
</template>
