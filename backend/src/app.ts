import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger, morganStream } from './logger.js';
import { runCrawler } from './crawlers/index.js';
import { getEM } from './orm.js';
import { NewsModel } from './models/news.model.js';
import { NewsSourceId } from '#shared/types/news.js';

const app: Application = express();
const port: number = 3000;

app.set('trust proxy', 1);

app.use(morgan('combined', { stream: morganStream }));

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://18.180.165.190',
  'https://gamenews.top',
  'https://www.gamenews.top',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        const msg = `CORS policy: The origin '${origin}' is not allowed.`;
        logger.warn(`CORS Blocked: ${origin}`); // Log blocked origin
        return callback(new Error(msg), false);
      }
    },
  })
);

// --- Routes ---
// (Keep the rest of your routes using logger.info, logger.error etc. as before)
app.get('/', (req: Request, res: Response) => {
  res.send('Game News Center API');
});

// Get all news with pagination
app.get('/api/news', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    logger.debug(`Fetching news: page=${page}, limit=${limit}`);
    const em = await getEM();

    const [news, total] = await em.findAndCount(
      NewsModel,
      {},
      {
        orderBy: { date: 'DESC' },
        limit,
        offset: (page - 1) * limit,
      }
    );

    logger.info(`Found ${news.length} news items out of ${total}`);

    res.json({
      data: news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get news by source
app.get('/api/news/source/:source', async (req: Request, res: Response) => {
  try {
    const { source } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    logger.debug(
      `Fetching news for source ${source}: page=${page}, limit=${limit}`
    );
    const em = await getEM();

    const [news, total] = await em.findAndCount(
      NewsModel,
      { source: source as NewsSourceId },
      {
        orderBy: { date: 'DESC' },
        limit,
        offset: (page - 1) * limit,
      }
    );

    logger.info(
      `Found ${news.length} news items for source ${source} out of ${total}`
    );

    res.json({
      data: news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Error fetching news by source ${req.params.source}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manually trigger crawler
app.post('/api/crawler/run', async (req: Request, res: Response) => {
  logger.info('Manual crawler run triggered.');
  try {
    await runCrawler();
    logger.info('Crawler job finished successfully (triggered manually).');
    res.json({ message: 'Crawler job triggered successfully' });
  } catch (error) {
    logger.error('Error triggering crawler manually:', error);
    res.status(500).json({ error: 'Failed to trigger crawler' });
  }
});

// Get crawler status
app.get('/api/crawler/status', async (req: Request, res: Response) => {
  try {
    logger.debug('Fetching crawler status.');
    const em = await getEM();
    const totalNews = await em.count(NewsModel);

    const [latestNews] = await em.find(
      NewsModel,
      {},
      {
        orderBy: { date: 'DESC' },
        limit: 1,
      }
    );

    const lastUpdate = latestNews?.date || null;
    logger.info(
      `Crawler status: totalNews=${totalNews}, lastUpdate=${lastUpdate}`
    );

    res.json({
      totalNews,
      lastUpdate: lastUpdate,
      status: 'running',
    });
  } catch (error) {
    logger.error('Error getting crawler status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Start Server ---
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Log level set to: ${logger.level}`);
});

// Optional: Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  // Use unknown type for reason, more type-safe than any
  logger.error(
    'Unhandled Rejection at:',
    promise,
    'reason:',
    reason as unknown
  );
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  // Consider exiting gracefully after logging
  // process.exit(1);
});

export default app;
