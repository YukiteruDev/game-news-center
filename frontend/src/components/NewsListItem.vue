<script setup lang="ts">
import { type NewsItem } from '#shared/types/news';
import { getISODateTime, getFullDateTime, formatDateTime } from '../utils';

const props = defineProps<{
  item: NewsItem;
}>();
</script>

<template>
  <article class="news-item">
    <header class="news-item__header">
      <a :href="props.item.link" target="_blank">
        <img
          :src="props.item.thumbnail"
          :alt="props.item.title"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
      </a>
    </header>
    <section class="news-item__content">
      <h3 class="news-item__title">
        <a :href="props.item.link" target="_blank">{{ props.item.title }}</a>
      </h3>
      <p class="news-item__meta">
        <time
          v-if="props.item.date"
          :datetime="getISODateTime(props.item.date)"
          :title="getFullDateTime(props.item.date)"
          class="news-item__date"
        >
          {{ formatDateTime(props.item.date) }}
        </time>
        <span class="news-item__comments"
          >{{ props.item.commentsCount }} 评论</span
        >
      </p>
    </section>
  </article>
</template>
