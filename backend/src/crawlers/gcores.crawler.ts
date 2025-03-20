import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import dayjs from 'dayjs';
import { pathToFileURL } from 'url';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';

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

  const script = $('body > script').first().html();
  const match = script?.match(/window\.__PRELOADED_STATE__\s*=\s*({.*?});/s);

  const newsItems: NewsItem[] = [];

  if (match) {
    const preloadedState = JSON.parse(match[1]);

    const articles = preloadedState.entities.articles;

    const articleLinks: string[] = Object.keys(articles).map(
      (id) => `${baseUrl}/articles/${id}`
    );
    const em = await getEM();
    const newLinks = await filterNewLinks(em, articleLinks);

    if (!newLinks.length) {
      console.log('No new items found in Gcores');
      return [];
    }

    for (const id in articles) {
      const link = `${baseUrl}/articles/${id}`;

      if (!newLinks.includes(link)) continue;

      const article = articles[id];
      const info = article.attributes;

      const title: string = info.title;

      const dateString: string = info['published-at'];
      const date = dayjs(dateString).toDate();

      const commentsCount: number = parseInt(info['comments-count']) || 0;
      const thumbnail: string = `https://image.gcores.com/${info.thumb}`;

      newsItems.push({
        link,
        title,
        date,
        commentsCount,
        thumbnail,
        source: 'gcores',
      });
    }
  }

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
