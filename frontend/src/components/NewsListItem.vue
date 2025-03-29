<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import {
  getNewsSourceById,
  type NewsItem,
  type NewsSource,
} from '#shared/types/news';
import { getSourceIcon } from '../utils';
import { getISODateTime, getFullDateTime, formatDateTime } from '../utils/time';
import { useNewsListStore } from '../stores/newsList';

const { isDefaultTabActive } = storeToRefs(useNewsListStore());

const props = defineProps<{
  item: NewsItem;
  isLastItem: boolean;
}>();

const newsSite = ref<NewsSource>({} as NewsSource);

onMounted(() => {
  getNewsSite();
});

function getNewsSite() {
  const sourceId = props.item.source;
  const site = getNewsSourceById(sourceId) as NewsSource;
  newsSite.value = site;
}

onMounted(() => {
  getNewsSite();
});
</script>

<template>
  <article class="news-item" :class="{ 'bottom-border': !isLastItem }">
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
      <a
        class="news-item__link"
        :href="props.item.link"
        :title="props.item.title"
        target="_blank"
      >
        <h3 class="news-item__title">
          {{ props.item.title }}
        </h3>
        <p v-if="props.item.description" class="news-item__description">
          {{ props.item.description }}
        </p>
      </a>
      <small class="news-item__meta">
        <span v-if="isDefaultTabActive" class="news-item__site">
          <img :src="getSourceIcon(newsSite.id)" :alt="newsSite.name" />
          {{ newsSite.name }}
        </span>
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
      </small>
    </section>
  </article>
</template>

<style scoped lang="less">
.news-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;

  &.bottom-border {
    border-bottom: 1px solid var(--accent-color);
  }

  .news-item__header {
    flex: 0 0 30%;
    a.news-item__cover {
      display: flex;
      aspect-ratio: 5 / 3;
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
  }

  .news-item__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
    overflow: hidden;

    a.news-item__link {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s ease-in-out;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      line-clamp: 4;
      text-overflow: ellipsis;
      overflow: hidden;

      .news-item__title {
        font-size: 1.2rem;
        line-height: 1.4rem;
        margin-bottom: 0.3rem;

        @media screen and (max-width: 800px) {
          font-size: 0.9rem;
          line-height: 1.2rem;
        }
      }

      .news-item__description {
        color: var(--secondary-text-color);
        font-size: 0.9rem;

        @media screen and (max-width: 800px) {
          font-size: 0.8rem;
        }
      }

      &:hover,
      &:active {
        color: var(--link-color);
      }

      @media screen and (max-width: 600px) {
        -webkit-line-clamp: 3;
        line-clamp: 3;
      }
    }

    .news-item__meta {
      display: flex;
      gap: 1rem;
      time,
      span {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.85rem;
        color: var(--secondary-text-color);
      }

      span.news-item__site {
        padding: 0.2rem 0.6rem;
        background-color: var(--accent-color);
        border-radius: 0.5rem;
        color: var(--text-color);
        font-size: 0.8rem;
        img {
          max-height: 0.9rem;
        }
      }
    }
  }
}
</style>
