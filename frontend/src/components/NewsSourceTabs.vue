<script setup lang="ts">
import { newsSources, type NewsSourcesId } from '../types';

defineProps<{
  activeTab: NewsSourcesId;
}>();

const emit = defineEmits<{
  (e: 'update-active-tab', id: NewsSourcesId): void;
}>();
</script>

<template>
  <section>
    <h2 class="sr-only">选择新闻来源</h2>
    <ul class="news-source-tabs" role="tablist">
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
          @click="emit('update-active-tab', source.id)"
        >
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
    li.news-source-tab {
      padding-bottom: 0.5rem;
      &.active {
        border-bottom: 2px solid var(--active-color);
      }
      &:not(.active) {
        button:hover {
          background-color: var(--accent-color);
        }
      }
      button {
        padding: 0 0.6rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }
    }
  }
}
</style>
