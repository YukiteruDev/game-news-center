import axios from 'axios';
import type { NewsItem } from '#shared/types/news';
import type { NewsSourcesId, Pagination } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiClient = axios.create({ baseURL });

export async function getNewsList(
  source: NewsSourcesId = 'all',
  page: number = 1
): Promise<{
  data: NewsItem[];
  pagination: Pagination;
}> {
  let url = '/news';
  if (source !== 'all') {
    url += `/source/${source}`;
  }
  url += `?page=${page}`;

  const res = await apiClient.get(url);
  return res.data;
}
