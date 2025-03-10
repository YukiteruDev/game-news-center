import * as dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { NewsModel } from './src/models/news.model.js';

export default defineConfig({
  entities: [NewsModel],
  dbName: 'game_news_db',
  driver: PostgreSqlDriver,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  debug: process.env.NODE_ENV !== 'prodocution',
  extensions: [Migrator],
  migrations: {
    path: './migrations',
  },
});
