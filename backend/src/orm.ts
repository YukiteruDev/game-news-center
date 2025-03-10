import { MikroORM } from '@mikro-orm/core';
import { NewsModel } from './models/news.model.js';
import config from '../mikro-orm.config.js';

async function fetch_items() {
  try {
    const orm = await MikroORM.init(config);
    const globalEm = orm.em;

    const em = globalEm.fork();

    const newsCount = await em.count(NewsModel);
    console.log(`Counted ${newsCount} items`);

    await orm.close();

    return newsCount;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
}

fetch_items().catch(console.error);
