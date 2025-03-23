import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import dayjs from 'dayjs';
import { pathToFileURL } from 'url';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';

const rssUrl = 'http://www.gamelook.com.cn/feed/';

export default async function parseNewsItems(): Promise<NewsItem[]> {
  console.log('Fetching GameLook...');

  const parser = new Parser();
  const feed = await parser.parseURL(rssUrl);

  const em = await getEM();
  const articleLinks: string[] = feed.items.map((item) => item.link as string);
  const newLinks = await filterNewLinks(em, articleLinks);

  if (!newLinks.length) {
    console.log('No new items found in GameLook RSS');
    return [];
  }

  const newsItems: NewsItem[] = [];

  for (const item of feed.items) {
    if (!item.link || !newLinks.includes(item.link)) continue;

    const title = item.title || '';
    const date = dayjs(item.isoDate).toDate();
    const { description, thumbnail } = extractDescriptionAndThumbnail(
      item['content:encoded']
    );
    const link = item.link;

    newsItems.push({
      title,
      date,
      description,
      thumbnail,
      link,
      source: 'gamelook',
    });
  }

  return newsItems;
}

function extractDescriptionAndThumbnail(content: string) {
  const $ = cheerio.load(content);

  const gameLookParagraph = $('p').filter(function () {
    return $(this).text().trim().startsWith('GameLook报道/');
  });
  const description = gameLookParagraph
    .text()
    .trim()
    .replace('GameLook报道/', '');

  const thumbnail = $('img').first().attr('src') || '';

  return { description, thumbnail };
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
