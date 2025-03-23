import Parser from 'rss-parser';
import dayjs from 'dayjs';
import { pathToFileURL } from 'url';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';

const baseUrl = 'https://www.gcores.com';
const rssUrl = `${baseUrl}/rss`;

export default async function parseNewsItems(): Promise<NewsItem[]> {
  console.log('Fetching Gcores...');

  const parser = new Parser();
  const feed = await parser.parseURL(rssUrl);

  const em = await getEM();
  const articleLinks: string[] = feed.items.map((item) => item.link as string);
  const newLinks = await filterNewLinks(em, articleLinks);

  if (!newLinks.length) {
    console.log('No new items found in Gcores RSS');
    return [];
  }

  const newsItems: NewsItem[] = [];

  for (const item of feed.items) {
    if (!item.link || !newLinks.includes(item.link)) continue;

    const title = item.title || '';
    const date = dayjs(item.isoDate).toDate();
    const description = extractDescription(item.contentSnippet);
    const thumbnail = extractThumbnail(item.content);
    const link = item.link;

    newsItems.push({
      title,
      date,
      description,
      thumbnail,
      link,
      source: 'gcores',
    });
  }

  return newsItems;
}

function extractDescription(contentSnippet?: string): string {
  if (!contentSnippet) return '';

  const blocks = contentSnippet.split('\n');
  const firstBlock = blocks[0];
  const secondBlock = blocks[1];

  const invalidFirstBlock =
    firstBlock.length < 10 || firstBlock.includes('本期时间轴制作');

  return invalidFirstBlock ? secondBlock : firstBlock;
}

function extractThumbnail(content?: string): string {
  if (!content) return '';

  const match = content.match(/<img.*?src="(.*?)"/);

  if (!match) return '';

  try {
    const imageUrl = new URL(match[1]);
    imageUrl.search = '';
    imageUrl.hash = '';
    return imageUrl.href;
  } catch {
    return '';
  }
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
