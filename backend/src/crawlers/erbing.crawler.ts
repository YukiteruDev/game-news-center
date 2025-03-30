import axios from 'axios';
import puppeteer, { Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { NewsItem, NewsSourceId } from '#shared/types/news.js';
import { pathToFileURL } from 'url';
import { logger } from '../logger.js';
import { closeORM, filterNewLinks, getEM } from '../orm.js';
import { getUtcDate } from '../utils.js';

const baseUrl = 'https://diershoubing.com';

function getNewsLinks($: CheerioAPI): string[] {
  const dataSelector = 'script[type="application/json"][id="__NUXT_DATA__"]';
  const dataString = $(dataSelector).text();
  const data = JSON.parse(dataString);

  const urls: string[] = [];
  data.forEach((str: string) => {
    if (typeof str !== 'string') return;
    const matched = str.match(/^https:\/\/diershoubing\.com\/news\/\d+\//);
    if (!matched) return;

    const url = str;
    urls.push(url);
  });
  return urls;
}

export default async function getNewsItems(): Promise<NewsItem[]> {
  const res = await axios.get(baseUrl);
  const $: CheerioAPI = cheerio.load(res.data);

  const em = await getEM();
  const newsLinks = getNewsLinks($);
  const newLinks = await filterNewLinks(em, newsLinks);

  if (!newLinks.length) {
    return [];
  }

  const newsItems: NewsItem[] = [];

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  logger.info(`[Crawler] Browser launched`);

  try {
    const page = await browser.newPage();
    logger.info(`[Crawler] Browser new page created`);

    for (const [index, link] of newLinks.entries()) {
      logger.info(
        `[Crawler] Fetching ${index + 1} of ${newLinks.length} news from Erbing`
      );
      const newsItem = await fetchNewsInfo(page, link);
      if (newsItem) {
        newsItems.push(newsItem);
      } else {
        logger.warn(`[Crawler] Failed to fetch news info from: ${link}`);
      }
    }

    return newsItems;
  } finally {
    await browser.close();
  }
}

async function fetchNewsInfo(page: Page, url: string): Promise<NewsItem> {
  await page.goto(url, { waitUntil: 'networkidle2' });

  const articleAreaSelector = '#home_container .article_area';
  await page.waitForSelector(articleAreaSelector);

  const html = await page.content();
  const $ = cheerio.load(html);

  const articleArea = $(articleAreaSelector);

  const title = articleArea.find('.news_title_bar > span').text();

  const sideInfo = articleArea.find('.news_title_bar > div');

  const descriptionText = articleArea.find('.article_body .content').text();
  const description = cleanDescription(descriptionText);

  const dateEl = sideInfo.find('.item').first();
  dateEl.find('svg').remove();
  const dateString = dateEl.text().trim();
  const date = getUtcDate(dateString);

  let commentsCount = 0;
  const commentsEl = sideInfo.find('.item').last();
  if (commentsEl.text() !== dateEl.text()) {
    commentsEl.find('svg').remove();
    const commentsText = commentsEl.text();
    commentsCount = parseInt(commentsText) || 0;
  }

  const image = articleArea.find('.media img').first();
  const imageSrc = image.attr('src') || '';
  const thumbnail = imageSrc.replace(/\?.*$/, '');

  const source: NewsSourceId = 'erbing';

  return {
    link: url,
    title,
    description,
    date,
    commentsCount,
    thumbnail,
    source,
  };
}

function cleanDescription(text: string): string {
  let cleanedText = text;

  cleanedText = cleanedText.replace(/^【.*?】/, '');
  cleanedText = cleanedText.trim();
  cleanedText = cleanedText.split('\n')[0];

  return cleanedText.slice(0, 1000);
}

async function main() {
  try {
    const items = await getNewsItems();
    console.log(items);
  } catch (error) {
    console.error('Error getting news data:', error);
  } finally {
    await closeORM();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
