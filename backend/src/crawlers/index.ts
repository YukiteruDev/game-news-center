import { CronJob } from 'cron';
import { pathToFileURL } from 'url';
import * as http from 'http';
import { logger } from '../logger.js';
import getGcoresNews from './gcores.crawler.js';
import getErbingNews from './erbing.crawler.js';
import getGamerskyNews from './gamersky.crawler.js';
import getIthomeNews from './ithome.crawler.js';
import getGamelookNews from './gamelook.crawler.js';
import { NewsItem } from '#shared/types/news.js';
import { closeORM, getEM } from '../orm.js';
import { NewsModel } from '../models/news.model.js';

const CRON_SCHEDULE = '0 */1 * * *';

async function runSingleCrawler(
  crawlerFn: () => Promise<NewsItem[]>,
  sourceName: string
): Promise<NewsItem[]> {
  logger.info(`[Crawler] Fetching news from ${sourceName}...`);
  try {
    const news = await crawlerFn();
    logger.info(`[Crawler] Fetched ${news.length} items from ${sourceName}.`);
    return news;
  } catch (error) {
    logger.error(`[Crawler] Failed to fetch news from ${sourceName}:`, error);
    return [];
  }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  logger.info('[Crawler] Starting fetchAllNews process...');

  const results = await Promise.allSettled([
    runSingleCrawler(getGcoresNews, 'Gcores'),
    runSingleCrawler(getErbingNews, 'Erbing'),
    runSingleCrawler(getGamerskyNews, 'Gamersky'),
    runSingleCrawler(getIthomeNews, 'ITHome'),
    runSingleCrawler(getGamelookNews, 'Gamelook'),
  ]);

  const allNewsItems: NewsItem[] = results
    .filter(
      (result): result is PromiseFulfilledResult<NewsItem[]> =>
        result.status === 'fulfilled'
    )
    .flatMap((result) => result.value);

  logger.info(
    `[Crawler] Fetched a total of ${allNewsItems.length} news items from all sources.`
  );

  if (allNewsItems.length === 0) {
    logger.warn(
      '[Crawler] No news items were fetched in this run. Skipping persistence.'
    );
    return [];
  }

  let em;
  try {
    logger.info(
      `[Crawler] Attempting to persist ${allNewsItems.length} fetched news items...`
    );
    em = await getEM();

    const newsModelInstances = allNewsItems.map((item) => new NewsModel(item));

    await em.persistAndFlush(newsModelInstances); // Persist new entities
    logger.info(
      `[Crawler] Successfully persisted/flushed ${newsModelInstances.length} news items.`
    );
  } catch (error) {
    logger.error('[Crawler] Error persisting news items:', error);
  } finally {
    if (import.meta.url === pathToFileURL(process.argv[1]).href) {
      logger.info('[Crawler] Script run directly, closing ORM connection.');
      if (em) {
        await closeORM();
      } else {
        logger.warn(
          '[Crawler] ORM EntityManager was not initialized, cannot close connection.'
        );
      }
    } else {
      logger.debug(
        '[Crawler] Script run as module, ORM connection remains open.'
      );
    }
  }

  return allNewsItems;
}

export async function runCrawler() {
  logger.info(
    `[Cron] Cron job triggered (schedule: ${CRON_SCHEDULE}). Running crawler...`
  );
  try {
    await fetchAllNews();
    logger.info('[Cron] Crawler execution finished successfully.');
  } catch (error) {
    logger.error('[Cron] Cron job execution failed:', error);
  }
}

// --- Cron Job Initialization ---
logger.info(`[Cron] Initializing Cron job with schedule: ${CRON_SCHEDULE}`);
const job = new CronJob(
  CRON_SCHEDULE, // Cron schedule string
  runCrawler, // Function to execute
  () => {
    // onComplete callback (optional)
    logger.info('[Cron] Cron job run completed (onComplete callback).');
  },
  true, // Start the job right now
  'Asia/Shanghai', // Time zone
  null, // Context (optional)
  true // Run job on init (runCrawler will execute immediately upon start)
);

if (job.isActive) {
  logger.info(
    `[Cron] Cron job started successfully. Next run scheduled for: ${job.nextDate().toFormat('yyyy-LL-dd HH:mm:ss ZZZZ')}`
  );
} else {
  logger.warn('[Cron] Cron job was initialized but is not running.');
}

// --- Keep Alive Server ---
const keepAlivePort = 3001;
http
  .createServer((req, res) => {
    // Simple response to indicate service is alive, maybe for health checks
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Crawler service keep-alive ping OK\n');
    logger.debug(`[KeepAlive] Received ping on port ${keepAlivePort}`); // Log pings if needed (debug level)
  })
  .listen(keepAlivePort, () => {
    logger.info(
      `[KeepAlive] Server running on port ${keepAlivePort} to keep process alive.`
    );
  });
