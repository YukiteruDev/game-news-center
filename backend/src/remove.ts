import { NewsModel } from './models/news.model.js';
import { closeORM, getEM } from './orm.js';

const em = await getEM();

await em.nativeDelete(NewsModel, { source: 'gamersky' });
await em.flush();

await closeORM();
