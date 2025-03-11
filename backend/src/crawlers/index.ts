import getGcoresNews from './gcores.crawler.js';
import { NewsItem } from '#shared/types/news-item.js';
import { pathToFileURL } from 'url';

async function fetchAllNews() {
  console.log('Fetching all news...');

  const [gcoresNews] = await Promise.all([getGcoresNews()]);

  const allNewsItems: NewsItem[] = [...gcoresNews];

  console.log(`Fetched ${allNewsItems.length} news items`);

  return allNewsItems;
}

async function main() {
  try {
    await fetchAllNews();
  } catch (error) {
    console.error('Error fetching all news', error);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
