export interface NewsItem {
  id: string;
  link: string;
  title: string;
  time: string;
  commentsCount: number;
  thumbnail?: string;
  source: string;
}
