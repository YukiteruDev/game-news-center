<script setup lang="ts">
import { type NewsItem } from '#shared/types/news';
import NewsListItem from './NewsListItem.vue';

const props = defineProps<{
  newsList: NewsItem[];
}>();
</script>

<template>
  <ul class="news-list">
    <li v-for="item in props.newsList" :key="item.id">
      <NewsListItem :item="item" />
    </li>
  </ul>
</template>

<style scoped lang="less">
.news-list {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 1rem;
}
</style>
