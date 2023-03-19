import { CalDavCalendar } from './calendars/caldav';
import {
  GoogleCalendar,
  type GoogleCalendarProps,
} from './calendars/google-calendar';
import type { CalendarConfig, CalendarDay, TimeInterval } from './schema';
import { mergeIntervals } from './utils';

export async function getBusyTimes({
  calendars,
  google,
  interval,
}: {
  calendars: CalendarConfig[];
  google?: Omit<GoogleCalendarProps, 'calendarId' | 'credentials'> | undefined;
  interval: TimeInterval;
}) {
  const promises = calendars.map((calendarConfig) => {
    switch (calendarConfig.type) {
      case 'caldav': {
        const calendar = CalDavCalendar({
          calendarId: calendarConfig.calendarId,
          credentials: calendarConfig.auth,
          serverUrl: calendarConfig.serverUrl,
        });
        return calendar.getBusyIntervals(interval);
      }
      case 'googlecalendar': {
        if (!google) {
          throw new Error('Missing Google configuration');
        }
        const calendar = GoogleCalendar({
          ...google,
          calendarId: calendarConfig.calendarId,
          credentials: calendarConfig.auth,
        });
        return calendar.getBusyIntervals(interval);
      }
      default:
        throw new Error(
          `Unsupported calendar type ${
            (calendarConfig as { type: string }).type
          }`,
        );
    }
  });

  return mergeIntervals((await Promise.all(promises)).flat());
}

export async function getCalendarDays({
  calendars,
  freeHoursByWeekday,
  google,
  maxDaysFromToday,
  now,
  startingAt,
}: {
  calendars: CalendarConfig[];
  freeHoursByWeekday: Record<number, { from: number; until: number }>;
  google?: Omit<GoogleCalendarProps, 'calendarId' | 'credentials'>;
  maxDaysFromToday: number;
  now: Date;
  startingAt: Date;
}) {
  const calendarDay: CalendarDay = {
    year: startingAt.getFullYear(),
    month: startingAt.getMonth(),
    day: startingAt.getDate(),
  };

  // Offset to calculate the output hours in the expected user's timezone
  const hoursOffset = startingAt.getHours() - startingAt.getUTCHours();

  const interval: TimeInterval = {
    from: now,
    until: new Date(now.getTime() + maxDaysFromToday * 24 * 60 * 60 * 1000 - 1),
  };
  const unavailableTimes: TimeInterval[] = [];
  for (let weekday = 0; weekday < 7; weekday++) {
    const freeHours = freeHoursByWeekday[weekday];
    if (!freeHours) {
      continue;
    }
    if (freeHours.from > 0) {
      const busyTime: TimeInterval = {
        from: new Date(
          calendarDay.year,
          calendarDay.month,
          calendarDay.day,
          hoursOffset,
          0,
          0,
        ),
        until: new Date(
          calendarDay.year,
          calendarDay.month,
          calendarDay.day,
          freeHours.from + hoursOffset - 1,
          59,
          59,
        ),
      };
      unavailableTimes.push(busyTime);
    }
    if (freeHours.until < 24) {
      const busyTime: TimeInterval = {
        from: new Date(
          calendarDay.year,
          calendarDay.month,
          calendarDay.day,
          freeHours.until + hoursOffset,
          0,
          0,
        ),
        until: new Date(
          calendarDay.year,
          calendarDay.month,
          calendarDay.day,
          hoursOffset + 23,
          59,
          59,
        ),
      };
      unavailableTimes.push(busyTime);
    }
  }
  const busyTimes = await getBusyTimes({ calendars, google, interval });
  return {
    busyTimes: mergeIntervals([...busyTimes, ...unavailableTimes]),
  };
}
