import {
  Entity,
  Unique,
  PrimaryKey,
  Property,
  DateTimeType,
} from '@mikro-orm/core';
import { NewsSourceId, NewsItem } from '#shared/types/news.js';

@Entity()
@Unique({ properties: ['link'] })
export class NewsModel implements NewsItem {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ type: 'string', unique: true, index: true })
  link: string;

  @Property({ type: 'string' })
  title: string;

  @Property({ type: 'string', length: 1000, nullable: true })
  description?: string;

  @Property({ type: DateTimeType })
  date: Date;

  @Property({ type: 'integer', default: 0, nullable: true })
  commentsCount: number;

  @Property({ type: 'string' })
  thumbnail: string;

  @Property({ type: 'string' })
  source: NewsSourceId;

  @Property({ onCreate: () => new Date(), type: 'date' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt: Date = new Date();

  constructor(newsItem: NewsItem & { source: string }) {
    this.link = newsItem.link;
    this.title = newsItem.title;
    this.description = newsItem.description;
    this.date = newsItem.date;
    this.commentsCount = newsItem.commentsCount ?? 0;
    this.thumbnail = newsItem.thumbnail;
    this.source = newsItem.source;
  }
}
