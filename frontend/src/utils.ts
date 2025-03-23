import dayjs from 'dayjs';
import type { NewsSourcesId } from './types';

export function getISODateTime(date: Date) {
  return date.toISOString();
}

export function getFullDateTime(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function getSourceIcon(id: NewsSourcesId) {
  let iconPath = `./assets/icons/icon-${id}.png`;
  if (id === 'all') iconPath = '/vite.svg';
  return new URL(iconPath, import.meta.url).href;
}

export function formatDateTime(date: Date): string {
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} 分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} 小时前`;
  } else {
    return getFullDateTime(date);
  }
}
