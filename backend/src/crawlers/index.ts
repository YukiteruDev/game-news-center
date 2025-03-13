import getGcoresNews from './gcores.crawler.js';
import getErbingNews from './erbing.crawler.js';
import { NewsItem } from '#shared/types/news-item.js';
import { pathToFileURL } from 'url';

async function fetchAllNews(): Promise<NewsItem[]> {
  console.log('Fetching all news...');

  const gcoresNews = await getGcoresNews();
  console.log(`Fetched ${gcoresNews.length} Gcores news items`);

  const erbingNews = await getErbingNews();
  console.log(`Fetched ${erbingNews.length} Erbing news items`);

  const allNewsItems = [...gcoresNews, ...erbingNews];

  console.log(`Fetched ${allNewsItems.length} news items`);

  return allNewsItems;
}

async function main() {
  try {
    const news = await fetchAllNews();
    console.log(news);
  } catch (error) {
    console.error('Error fetching all news', error);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
