import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

export function getLocaleDate(dateString: string): Date {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const rawDate = dayjs(dateString).toDate();
  const date = dayjs.tz(rawDate, 'Asia/Shanghai').toDate();
  return date;
}
