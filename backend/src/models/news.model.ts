import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { NewsSource, NewsItem } from '#shared/types/news-item.js';

@Entity()
export class NewsModel implements NewsItem {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'string', unique: true, index: true })
  link: string;

  @Property({ type: 'string' })
  title: string;

  @Property()
  date: Date;

  @Property({ type: 'integer', default: 0 })
  commentsCount: number;

  @Property({ type: 'string' })
  thumbnail: string;

  @Property({ type: 'string' })
  source: NewsSource;

  @Property({ onCreate: () => new Date(), type: 'date' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt: Date = new Date();

  constructor(newsItem: NewsItem & { source: string }) {
    this.link = newsItem.link;
    this.title = newsItem.title;
    this.date = newsItem.date;
    this.commentsCount = newsItem.commentsCount;
    this.thumbnail = newsItem.thumbnail;
    this.source = newsItem.source;
  }
}
