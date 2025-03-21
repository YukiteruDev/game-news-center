<script setup lang="ts">
import { ref } from 'vue';
import { newsSources, type NewsSourcesId } from '../types';

const props = defineProps<{
  initialSource: NewsSourcesId;
}>();

const selectedSource = ref<NewsSourcesId>(props.initialSource);

function updateSelectedSource(id: NewsSourcesId) {
  selectedSource.value = id;
}
</script>

<template>
  <ul id="news-sources">
    <li
      v-for="source in newsSources"
      :key="source.id"
      :class="{ active: source.id === selectedSource }"
    >
      <button @click="updateSelectedSource(source.id)">
        {{ source.name }}
      </button>
    </li>
  </ul>
</template>
