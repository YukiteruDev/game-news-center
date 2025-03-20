import express, { Application, Request, Response } from 'express';
import { runCrawler } from './crawlers/index.js';
import { getEM } from './orm.js';
import { NewsModel } from './models/news.model.js';
import { NewsSourceId } from '#shared/types/news.js';

const app: Application = express();
const port: number = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Game News Center API');
});

// Get all news with pagination
app.get('/api/news', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
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
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get news by source
app.get('/api/news/source/:source', async (req: Request, res: Response) => {
  try {
    const { source } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
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
    console.error('Error fetching news by source:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manually trigger crawler
app.post('/api/crawler/run', async (req: Request, res: Response) => {
  try {
    await runCrawler();
    res.json({ message: 'Crawler job triggered successfully' });
  } catch (error) {
    console.error('Error triggering crawler:', error);
    res.status(500).json({ error: 'Failed to trigger crawler' });
  }
});

// Get crawler status
app.get('/api/crawler/status', async (req: Request, res: Response) => {
  try {
    const em = await getEM();
    const totalNews = await em.count(NewsModel);

    // Get the latest news by date
    const [latestNews] = await em.find(
      NewsModel,
      {},
      {
        orderBy: { date: 'DESC' },
        limit: 1,
      }
    );

    res.json({
      totalNews,
      lastUpdate: latestNews?.date || null,
      status: 'running',
    });
  } catch (error) {
    console.error('Error getting crawler status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
