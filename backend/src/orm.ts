import { MikroORM, EntityManager } from '@mikro-orm/core';
import config from '../mikro-orm.config.js';
import { NewsItem } from '#shared/types/news-item.js';
import { NewsModel } from './models/news.model.js';

let ormInstance: MikroORM | null = null;

export async function getORM(): Promise<MikroORM> {
  if (ormInstance) return ormInstance;

  try {
    ormInstance = await MikroORM.init(config);
    console.log('ORM initialized');
  } catch (error) {
    console.error('Error during ORM initialization:', error);
    throw error;
  }
  return ormInstance;
}

export async function closeORM(): Promise<void> {
  if (!ormInstance) return;

  await ormInstance.close();
  console.log('ORM closed');
  ormInstance = null;
}

export async function getEM(): Promise<EntityManager> {
  const orm = await getORM();
  const globalEm: EntityManager = orm.em;
  return globalEm.fork();
}

export async function filterNewLinks(
  em: EntityManager,
  links: string[]
): Promise<string[]> {
  const existingItems: NewsItem[] = await em.find(NewsModel, {
    link: { $in: links },
  });
  const existingLinks = existingItems.map((item) => item.link);

  return links.filter((link) => !existingLinks.includes(link));
}
