import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getUtcDate(dateString: string): Date {
  const timeZone = 'Asia/Shanghai';

  return dayjs.tz(dateString, timeZone).toDate();
}
