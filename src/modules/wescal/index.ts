import { Temporal } from 'temporal-polyfill';

import { CalDavCalendar } from './calendars/caldav';
import {
  GoogleCalendar,
  type GoogleCalendarProps,
} from './calendars/google-calendar';
import type {
  CalendarConfig,
  DateTimeInterval,
  PlainTimeInterval,
} from './schema';
import {
  createUnavailableIntervals,
  createWeekDays,
  mergeIntervals,
} from './utils';

export async function getBusyTimes({
  calendars,
  google,
  interval,
}: {
  calendars: CalendarConfig[];
  google?: Omit<GoogleCalendarProps, 'calendarId' | 'credentials'> | undefined;
  interval: DateTimeInterval;
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
  freeTimeByWeekday,
  google,
  maxDaysFromToday,
  today,
  startingAt,
}: {
  calendars: CalendarConfig[];
  freeTimeByWeekday: Record<number, PlainTimeInterval>;
  google?: Omit<GoogleCalendarProps, 'calendarId' | 'credentials'>;
  maxDaysFromToday: number;
  today: Temporal.ZonedDateTime;
  startingAt: Temporal.PlainDate;
}) {
  const interval: DateTimeInterval = {
    from: today,
    until: today.add({ days: maxDaysFromToday }),
  };
  const days = createWeekDays({
    maxDaysFromToday,
    today,
    startingAtWeekday: startingAt.dayOfWeek,
  });
  const unavailableTimes = createUnavailableIntervals({
    freeTimeByWeekday,
    from: days.at(0) as Temporal.PlainDate,
    until: days.at(-1) as Temporal.PlainDate,
    timeZone: today.timeZone as Temporal.TimeZone,
  });

  const busyTimes = await getBusyTimes({ calendars, google, interval });

  return {
    busyTimes: mergeIntervals([...busyTimes, ...unavailableTimes]),
  };
}
