import { CalDavCalendar } from './calendars/caldav';
import {
  GoogleCalendar,
  type GoogleCalendarProps,
} from './calendars/google-calendar';
import type { TimeInterval, WesCalConfig } from './schema';
import { mergeIntervals } from './utils';

export async function getBusyTimes({
  config,
  google,
  interval,
}: {
  config: WesCalConfig;
  google?: Omit<GoogleCalendarProps, 'calendarId' | 'credentials'>;
  interval: TimeInterval;
}) {
  const promises = config.calendars.map((calendarConfig) => {
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
