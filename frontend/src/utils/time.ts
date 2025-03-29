import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/zh-cn';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('zh-cn');

export function getISODateTime(date: Date) {
  return dayjs(date).toISOString();
}

export function getFullDateTime(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateTime(date: Date): string {
  const dateObj = dayjs(date);
  return dateObj.fromNow();
}
