import type { NewsSourcesId } from '../types';

export function getSourceIcon(id: NewsSourcesId) {
  let iconPath = `/icons/icon-${id}.png`;
  if (id === 'all') iconPath = '/vite.svg';
  return new URL(iconPath, import.meta.url).href;
}
