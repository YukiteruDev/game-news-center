import axios from 'axios';
import puppeteer, { Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { NewsItem, NewsSource } from '#shared/types/news-item.js';
import { pathToFileURL } from 'url';
import { closeORM, filterNewLinks, getEM } from '../orm.js';
import { getLocaleDate } from '../utils.js';

const baseUrl = 'https://diershoubing.com';

async function fetchNewsHtml(): Promise<string> {
  try {
    const res = await axios.get(baseUrl);
    return res.data;
  } catch (error) {
    console.error('Error fetching news html', error);
    throw error;
  }
}

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
  console.log('Fetching Erbing...');
  const html = await fetchNewsHtml();
  const $: CheerioAPI = cheerio.load(html);

  const em = await getEM();
  const newsLinks = getNewsLinks($);
  const newLinks = await filterNewLinks(em, newsLinks);

  if (!newLinks.length) {
    console.log('No new items found in Erbing');
    return [];
  }

  const newsItems: NewsItem[] = [];

  const browser = await puppeteer.launch();
  console.log('Browser launched');

  try {
    const page = await browser.newPage();
    console.log('New page created');

    for (const link of newLinks) {
      const newsItem = await fetchNewsInfo(page, link);
      if (newsItem) {
        newsItems.push(newsItem);
      } else {
        console.warn(`Failed to fetch news info from: ${link}`);
      }
    }

    return newsItems;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function fetchNewsInfo(page: Page, url: string): Promise<NewsItem> {
  console.log('Fetching info from:', url);

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const articleAreaSelector = '#home_container .article_area';
    await page.waitForSelector(articleAreaSelector);

    const html = await page.content();
    const $ = cheerio.load(html);

    const articleArea = $(articleAreaSelector);

    const title = articleArea.find('.news_title_bar > span').text();

    const sideInfo = articleArea.find('.news_title_bar > div');

    const dateEl = sideInfo.find('.item').first();
    dateEl.find('svg').remove();
    const dateString = dateEl.text().trim();
    const date = getLocaleDate(dateString);

    let commentsCount = 0;
    const commentsEl = sideInfo.find('.item').last();
    if (commentsEl.text() !== dateEl.text()) {
      commentsEl.find('svg').remove();
      const commentsText = commentsEl.text();
      commentsCount = parseInt(commentsText) || 0;
    }

    const image = articleArea.find('.media').find('img').first();
    const imageSrc = image.attr('src') || '';
    const thumbnail = imageSrc.replace(/\?.*$/, '');

    const source: NewsSource = 'erbing';

    return {
      link: url,
      title,
      date,
      commentsCount,
      thumbnail,
      source,
    };
  } catch (error) {
    console.error('Error fetching news info', error);
    throw error;
  }
}

async function main() {
  try {
    await getNewsItems();
  } catch (error) {
    console.error('Error getting news data:', error);
  } finally {
    await closeORM();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
