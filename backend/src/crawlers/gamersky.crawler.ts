import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { pathToFileURL } from 'url';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';
import { getUtcDate } from '../utils.js';

const baseUrl = 'https://www.gamersky.com/pcgame/';

export default async function parseNewsItems(): Promise<NewsItem[]> {
  const res = await axios.get(baseUrl);
  const $: CheerioAPI = cheerio.load(res.data);

  const newsItems: NewsItem[] = [];

  const em = await getEM();
  const newsList = $('.Mid .Mid2_L ul.block li');
  const newsLinks = newsList
    .map((_, el) => $(el).find('.tit a').attr('href'))
    .get();
  const newLinks = await filterNewLinks(em, newsLinks);

  if (!newLinks.length) {
    return [];
  }

  newsList.each((_, news) => {
    const titleEl = $(news).find('.tit a');
    const title = titleEl.text();
    const link = titleEl.attr('href') || '';

    if (!newLinks.includes(link)) return;

    const description = $(news).find('.con .txt').text();

    const dateString = $(news).find('.time').text();
    const date = getUtcDate(dateString);

    const thumbnail = $(news).find('.img img').attr('src') || '';

    newsItems.push({
      title,
      link,
      description,
      date,
      thumbnail,
      source: 'gamersky',
    });
  });

  return newsItems;
}

async function main() {
  try {
    const newsItems = await parseNewsItems();
    console.log(newsItems);
  } catch (error) {
    console.error('Error parsing news items', error);
  } finally {
    await closeORM();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
