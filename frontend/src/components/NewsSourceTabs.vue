<script setup lang="ts">
import { nextTick, useTemplateRef } from 'vue';
import { newsSources, type NewsSourcesId } from '../types';
import { getSourceIcon } from '../utils';

defineProps<{
  activeTab: NewsSourcesId;
}>();

const emit = defineEmits<{
  (e: 'update-active-tab', id: NewsSourcesId): void;
}>();

const tabList = useTemplateRef<HTMLUListElement>('tablist');

async function handleTabClick(tabId: NewsSourcesId) {
  emit('update-active-tab', tabId);

  const ul = tabList.value as HTMLUListElement;
  await nextTick(() => scrollToActiveTab(ul));
}

function scrollToActiveTab(ul: HTMLUListElement) {
  const activeLi = ul.querySelector('.active') as HTMLLIElement;
  if (!activeLi) return;

  const liRect = activeLi.getBoundingClientRect();
  const ulRect = ul.getBoundingClientRect();

  const liLeft = liRect.left - ulRect.left;
  const liRight = liRect.right - ulRect.left;
  const ulWidth = ulRect.width;
  const scrollOffset = 200;

  if (liLeft < scrollOffset) {
    ul.scrollLeft -= scrollOffset - liLeft;
  } else if (liRight > ulWidth - scrollOffset) {
    ul.scrollLeft += liRight - (ulWidth - scrollOffset);
  }
}
</script>

<template>
  <section>
    <h2 class="sr-only">选择新闻来源</h2>
    <ul ref="tablist" class="news-source-tabs" role="tablist">
      <li
        v-for="source in newsSources"
        :key="source.id"
        :class="{ active: source.id === activeTab }"
        class="news-source-tab"
        role="presentation"
      >
        <button
          role="tab"
          :aria-selected="source.id === activeTab"
          :aria-controls="`news-list-${source.id}`"
          @click="handleTabClick(source.id)"
        >
          <img :src="getSourceIcon(source.id)" :alt="source.name" />
          {{ source.name }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="less">
section {
  background-color: var(--primary-color);
  padding: 0.6rem;
  padding-bottom: 0;
  border-radius: 0.8rem;
  position: sticky;
  top: 0;
  z-index: 10;

  h2.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  ul.news-source-tabs {
    display: flex;
    gap: 1rem;
    list-style: none;
    border-bottom: 1px solid var(--accent-color);
    overflow-x: auto;
    scrollbar-width: none;
    scroll-behavior: smooth;

    li.news-source-tab {
      padding-bottom: 0.5rem;
      flex-shrink: 0;

      &.active {
        border-bottom: 3px solid var(--active-color);
      }

      &:not(.active) {
        button:hover {
          background-color: var(--accent-color);
        }
      }

      button {
        padding: 0.1rem 0.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        img {
          max-height: 1rem;
        }
      }
    }
  }
}
</style>
