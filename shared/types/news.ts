export interface NewsSource {
  id: 'gcores' | 'erbing' | 'gamersky' | 'ithome' | 'gamelook';
  name: string;
}

export const NEWS_SOURCES: readonly NewsSource[] = [
  { id: 'gcores', name: '机核' },
  { id: 'erbing', name: '二柄' },
  { id: 'gamersky', name: '游民星空' },
  { id: 'ithome', name: 'IT之家' },
  { id: 'gamelook', name: '游戏大观' },
] as const;

export type NewsSourceId = (typeof NEWS_SOURCES)[number]['id'];

export function getNewsSourceById(id: NewsSourceId): NewsSource | undefined {
  return NEWS_SOURCES.find((source) => source.id === id);
}

export interface NewsItem {
  id?: string;
  link: string;
  title: string;
  description?: string;
  date: Date;
  commentsCount?: number;
  thumbnail: string;
  source: NewsSourceId;
}
