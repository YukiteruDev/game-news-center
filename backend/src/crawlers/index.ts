import { CronJob } from 'cron';
import { pathToFileURL } from 'url';
import * as http from 'http';
import getGcoresNews from './gcores.crawler.js';
import getErbingNews from './erbing.crawler.js';
import getGamerskyNews from './gamersky.crawler.js';
import getIthomeNews from './ithome.crawler.js';
import { NewsItem } from '#shared/types/news-item.js';
import { closeORM, getEM } from '../orm.js';
import { NewsModel } from '../models/news.model.js';

async function fetchAllNews(): Promise<NewsItem[]> {
  console.log('Fetching all news...');

  const gcoresNews = await getGcoresNews();
  const erbingNews = await getErbingNews();
  const gamerskyNews = await getGamerskyNews();
  const ithomeNews = await getIthomeNews();

  const allNewsItems = [
    ...gcoresNews,
    ...erbingNews,
    ...gamerskyNews,
    ...ithomeNews,
  ];
  console.log(`Fetched ${allNewsItems.length} news items`);

  try {
    const em = await getEM();

    const newsModelInstances = allNewsItems.map((item) => new NewsModel(item));

    await em.persistAndFlush(newsModelInstances);
    console.log(`Persisted ${allNewsItems.length} news items`);
  } catch (error) {
    console.error('Error persisting news items', error);
  } finally {
    if (import.meta.url === pathToFileURL(process.argv[1]).href) {
      await closeORM();
    }
  }

  return allNewsItems;
}

async function runCrawler() {
  console.log('Cron job started');
  try {
    await fetchAllNews();
    console.log('Cron job completed');
  } catch (error) {
    console.log('Cron job failed:', error);
  }
}

// time, onTick, onComplete, start, timeZone, context, runOnInit
new CronJob('0 * * * *', runCrawler, null, true, 'Asia/Shanghai', null, true);

http.createServer().listen(3001); // keep alive
