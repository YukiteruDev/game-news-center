import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export function getISODateTime(date: Date) {
  return dayjs(date).toISOString();
}

export function getFullDateTime(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateTime(date: Date): string {
  return dayjs(date).fromNow();
}
