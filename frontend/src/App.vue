<script setup lang="ts">
import AppTitle from './components/AppTitle.vue';
import NewsList from './components/NewsList.vue';
import NewsSourceTabs from './components/NewsSourceTabs.vue';
import type { NewsSourcesId } from './types';
import { computed, onMounted, ref } from 'vue';
import type { NewsItem } from '#shared/types/news';
import { getNewsList } from './api';

const newsList = ref<NewsItem[]>([]);
const selectedSource = ref<NewsSourcesId>('all');
const page = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);

function updateSelectedSource(id: NewsSourcesId) {
  selectedSource.value = id;
  page.value = 1;
  newsList.value = [];
  fetchNewsList();
}

const hasMore = computed(() => {
  return page.value < totalPages.value;
});

async function fetchNewsList() {
  isLoading.value = true;
  try {
    const { data, pagination } = await getNewsList(
      selectedSource.value,
      page.value
    );
    newsList.value = [...newsList.value, ...data];
    totalPages.value = pagination.totalPages;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

function handleScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (isLoading.value || !hasMore.value) return;

    page.value += 1;
    fetchNewsList();
  }
}

onMounted(() => {
  fetchNewsList();
  window.addEventListener('scroll', handleScroll);
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
