import axios from 'axios';
import type { NewsItem } from '#shared/types/news';
import type { NewsSourcesId, Pagination } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export async function getNewsList(source: NewsSourcesId = 'all'): Promise<{
  data: NewsItem[];
  pagination: Pagination;
}> {
  let url = '/news';
  if (source !== 'all') {
    url += `/source/${source}`;
  }

  const res = await apiClient.get(url);
  return res.data;
}
