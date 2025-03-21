import { NEWS_SOURCES } from '#shared/types/news';

export const newsSources = [
  { id: 'all', name: '综合' },
  ...NEWS_SOURCES,
] as const;

export type NewsSourcesId = (typeof newsSources)[number]['id'];
