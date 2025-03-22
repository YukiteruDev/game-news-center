<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { type NewsItem } from '#shared/types/news';
import { getISODateTime, getFullDateTime, formatDateTime } from '../utils';

const props = defineProps<{
  item: NewsItem;
}>();
</script>

<template>
  <article class="news-item">
    <header class="news-item__header">
      <a class="news-item__cover" :href="props.item.link" target="_blank">
        <img
          :src="props.item.thumbnail"
          :alt="props.item.title"
          class="news-item__thumbnail"
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
          <Icon icon="lets-icons:time" />
          {{ formatDateTime(props.item.date) }}
        </time>
        <span v-if="props.item.commentsCount" class="news-item__comments">
          <Icon icon="lets-icons:comment" />{{
            props.item.commentsCount
          }}
          评论</span
        >
      </p>
    </section>
  </article>
</template>

<style scoped lang="less">
.news-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--accent-color);
  a.news-item__cover {
    display: flex;
    width: 200px;
    height: 120px;
    border-radius: 0.4rem;
    overflow: hidden;
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .news-item__thumbnail {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .news-item__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .news-item__title {
      a {
        color: var(--text-color);
        text-decoration: none;
        &:hover,
        &:active {
          color: var(--link-color);
        }
      }
    }
    .news-item__meta {
      display: flex;
      gap: 2rem;
      time,
      span {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.85rem;
        color: var(--secondary-text-color);
      }
    }
  }
}
</style>
