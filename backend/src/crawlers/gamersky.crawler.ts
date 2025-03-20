import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { pathToFileURL } from 'url';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';
import { getLocaleDate } from '../utils.js';

const baseUrl = 'https://www.gamersky.com';

async function fetchNewsHtml(): Promise<string> {
  try {
    const res = await axios.get(`${baseUrl}/news/pc/zx/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching news html', error);
    throw error;
  }
}

export default async function parseNewsItems(): Promise<NewsItem[]> {
  console.log('Fetching Gamersky...');
  const html = await fetchNewsHtml();

  const $: CheerioAPI = cheerio.load(html);

  const newsItems: NewsItem[] = [];

  const em = await getEM();
  const newsList = $('.Mid .Mid2_L ul li');
  const newsLinks = newsList
    .map((_, el) => $(el).find('.tit a').attr('href'))
    .get();
  const newLinks = await filterNewLinks(em, newsLinks);

  if (!newLinks.length) {
    console.log('No new items found in Gamersky');
    return [];
  }

  newsList.each((_, news) => {
    const titleEl = $(news).find('.tit a');
    const title = titleEl.text();
    const link = titleEl.attr('href') || '';

    if (!newLinks.includes(link)) return;

    const dateString = $(news).find('.time').text();
    const date = getLocaleDate(dateString);

    const commentsText = $(news).find('.pls.cy_comment').text().trim(); // will always be 0 since the comments are ajax loaded
    const commentsCount = parseInt(commentsText);

    const thumbnail = $(news).find('.img img').attr('src') || '';

    newsItems.push({
      title,
      link,
      date,
      commentsCount,
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
