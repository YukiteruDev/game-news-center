import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { NewsSourcesId } from '../types';

export const useNewsListStore = defineStore('newsList', () => {
  const activeTab = ref<NewsSourcesId>('all');

  const isDefaultTabActive = computed(() => activeTab.value === 'all');

  function setActiveTab(tabId: NewsSourcesId) {
    activeTab.value = tabId;
  }

  return { activeTab, isDefaultTabActive, setActiveTab };
});
