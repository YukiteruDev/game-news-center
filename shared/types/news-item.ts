export type NewsSource = 'gcores' | 'erbing' | 'gamersky' | 'ithome';

export interface NewsItem {
  id?: string;
  link: string;
  title: string;
  date: Date;
  commentsCount: number;
  thumbnail: string;
  source: NewsSource;
}
