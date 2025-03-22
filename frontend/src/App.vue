<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import AppTitle from './components/AppTitle.vue';
import NewsList from './components/NewsList.vue';
import NewsSourceTabs from './components/NewsSourceTabs.vue';
import type { NewsSourcesId } from './types';
import type { NewsItem } from '#shared/types/news';
import { getNewsList } from './api';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import { useNewsListStore } from './stores/newsList';

const newsListStore = useNewsListStore();
const { activeTab } = storeToRefs(newsListStore);
const { setActiveTab } = newsListStore;

const newsList = ref<NewsItem[]>([]);
const page = ref(1);
const totalPages = ref(0);
const isLoading = ref(false);

function updateActiveTab(id: NewsSourcesId) {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  setActiveTab(id);
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
    const { data, pagination } = await getNewsList(activeTab.value, page.value);

    const convertedData = data.map((item) => {
      return {
        ...item,
        date: new Date(item.date),
      };
    });

    newsList.value = [...newsList.value, ...convertedData];
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
  <header class="page-header">
    <section class="page-header__inner">
      <AppTitle title="Game News Center" />
      <ThemeSwitcher />
    </section>
  </header>
  <main class="main-content">
    <NewsSourceTabs
      :active-tab="activeTab"
      @update-active-tab="updateActiveTab"
    />
    <section class="news-list-container">
      <NewsList :news-list="newsList" />
    </section>
  </main>
</template>

<style scoped lang="less">
header.page-header {
  display: flex;
  margin-bottom: 1rem;
  padding: 1rem 0;
  background-color: var(--primary-color);
  border-bottom: 1px solid var(--accent-color);

  section.page-header__inner {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    max-width: 800px;

    @media screen and (max-width: 800px) {
      padding: 0 1rem;
    }
  }
}

main.main-content {
  width: 100%;
  margin: 0 auto;
  background-color: var(--primary-color);
  border: 1px solid var(--accent-color);
  border-radius: 0.8rem;

  .news-list-container {
    min-height: 100vh;
  }

  @media screen and (min-width: 800px) {
    max-width: 800px;
  }
}
</style>
