import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { pathToFileURL } from 'url';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';
import { getUtcDate } from '../utils.js';

const baseUrl = 'https://game.ithome.com';

export default async function parseNewsItems(): Promise<NewsItem[]> {
  const res = await axios.get(baseUrl);

  const $: CheerioAPI = cheerio.load(res.data);

  const newsItems: NewsItem[] = [];

  const em = await getEM();
  const newsList = $('#list ul.bl li');
  const newsLinks = newsList.map((_, el) => $(el).find('a').attr('href')).get();
  const newLinks = await filterNewLinks(em, newsLinks);

  if (!newLinks.length) {
    return [];
  }

  newsList.each((_, news) => {
    const titleEl = $(news).find('h2 a.title');
    const title = titleEl.text();
    const link = titleEl.attr('href') || '';

    if (!newLinks.includes(link)) return;

    const description = $(news).find('.m').text();

    const dateString = $(news).find('.c').attr('data-ot') || '';
    const date = getUtcDate(dateString);

    const imageSrc = $(news).find('img').attr('data-original') || '';
    const thumbnail = imageSrc.split('?')[0];

    newsItems.push({
      title,
      link,
      description,
      date,
      thumbnail,
      source: 'ithome',
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
