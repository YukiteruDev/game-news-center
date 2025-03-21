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
