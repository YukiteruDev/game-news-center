export type NewsSource = 'gcores' | 'erbing' | 'gamersky' | 'ithome';

export interface NewsItem {
  id?: string;
  link: string;
  title: string;
  time: string;
  commentsCount: number;
  thumbnail?: string;
  source: NewsSource;
}
