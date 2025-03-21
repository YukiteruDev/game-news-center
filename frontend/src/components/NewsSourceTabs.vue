<script setup lang="ts">
import { newsSources, type NewsSourcesId } from '../types';

defineProps<{
  selectedSource: NewsSourcesId;
}>();

const emit = defineEmits<{
  (e: 'update-selected-source', id: NewsSourcesId): void;
}>();
</script>

<template>
  <section>
    <h2 class="sr-only">选择新闻来源</h2>
    <ul class="news-source-tabs" role="tablist">
      <li
        v-for="source in newsSources"
        :key="source.id"
        :class="{ active: source.id === selectedSource }"
        class="news-source-tab"
        role="presentation"
      >
        <button
          role="tab"
          :aria-selected="source.id === selectedSource"
          :aria-controls="`news-list-${source.id}`"
          @click="emit('update-selected-source', source.id)"
        >
          {{ source.name }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
