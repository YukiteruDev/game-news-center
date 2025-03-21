<script setup lang="ts">
import AppTitle from './components/AppTitle.vue';
import NewsList from './components/NewsList.vue';
import NewsSourceTabs from './components/NewsSourceTabs.vue';
import type { NewsSourcesId } from './types';
import { onMounted, ref } from 'vue';
import type { NewsItem } from '#shared/types/news';
import { getNewsList } from './api';

const newsList = ref<NewsItem[]>([]);
const selectedSource = ref<NewsSourcesId>('all');

function updateSelectedSource(id: NewsSourcesId) {
  selectedSource.value = id;
  fetchNewsList();
}

async function fetchNewsList() {
  const { data, pagination } = await getNewsList(selectedSource.value);
  newsList.value = data;
  console.log(pagination);
}

onMounted(() => {
  fetchNewsList();
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
