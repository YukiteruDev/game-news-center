<script setup lang="ts">
import axios from 'axios';
import AppTitle from './components/AppTitle.vue';
import NewsList from './components/NewsList.vue';
import NewsSourceTabs from './components/NewsSourceTabs.vue';
import type { NewsSourcesId } from './types';
import { onMounted, ref } from 'vue';
import type { NewsItem } from '#shared/types/news';

const newsList = ref<NewsItem[]>([]);
const selectedSource = ref<NewsSourcesId>('all');

function updateSelectedSource(id: NewsSourcesId) {
  selectedSource.value = id;
  getNewsList();
}

async function getNewsList() {
  let url = 'http://localhost:3000/api/news';
  const source = selectedSource.value;
  if (source !== 'all') url += `/source/${source}`;

  const res = await axios.get(url);
  const data = res.data;
  const newsListData = data.data as NewsItem[];
  const pagination = data.pagination;

  newsList.value = newsListData;
  console.log(pagination);
}

onMounted(() => {
  getNewsList();
});
</script>

<template>
  <main>
    <AppTitle title="Game News Center" />
    <NewsSourceTabs
      :selected-source="selectedSource"
      @update-selected-source="updateSelectedSource"
    />
    <NewsList :news-list="newsList" />
  </main>
</template>

<style scoped></style>
