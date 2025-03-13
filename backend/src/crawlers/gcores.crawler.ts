import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { NewsItem } from '#shared/types/news-item.js';
import { pathToFileURL } from 'url';

const baseUrl = 'https://www.gcores.com';

async function fetchNewsHtml(): Promise<string> {
  try {
    const res = await axios.get(`${baseUrl}/news`);
    return res.data;
  } catch (error) {
    console.error('Error fetching news html', error);
    throw error;
  }
}

export default async function parseNewsItems(): Promise<NewsItem[]> {
  console.log('Fetching Gcores...');
  const html = await fetchNewsHtml();

  const $: CheerioAPI = cheerio.load(html);
  const newsItems: NewsItem[] = [];

  $('#app .navLayout_main .container a.news').each((_, element) => {
    const el = $(element);

    const href = el.attr('href') || '';
    const title = el.find('h3').text();
    const time = el.find('.news_meta span').first().text();

    const commentsSpan = el.find('.news_meta span').last();
    commentsSpan.find('b').remove();
    const commentsText = commentsSpan.text();
    const commentsCount = parseInt(commentsText) || 0;

    const backgroundImage = el.find('.news_imgArea').attr('style') || '';
    const thumbnailMatch = backgroundImage.match(/url\((.*?)\)/);
    const thumbnail = thumbnailMatch
      ? thumbnailMatch[1].split('?')[0]
      : undefined;

    const newsItem: NewsItem = {
      link: `${baseUrl}${href}`,
      title,
      time,
      commentsCount,
      thumbnail,
      source: 'gcores',
    };

    newsItems.push(newsItem);
  });

  return newsItems;
}

async function main() {
  try {
    const newsItems = await parseNewsItems();
    console.log(newsItems);
  } catch (error) {
    console.error('Error parsing news items', error);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
