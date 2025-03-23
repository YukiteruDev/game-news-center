<script setup lang="ts">
import { type NewsItem } from '#shared/types/news';
import NewsListItem from './NewsListItem.vue';

const props = defineProps<{
  newsList: NewsItem[];
}>();

function isLastItem(index: number) {
  return index === props.newsList.length - 1;
}
</script>

<template>
  <ul class="news-list">
    <li v-for="(item, index) in props.newsList" :key="item.id">
      <NewsListItem :item="item" :is-last-item="isLastItem(index)" />
    </li>
  </ul>
</template>

<style scoped lang="less">
.news-list {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
