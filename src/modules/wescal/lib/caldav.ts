import ICAL from 'ical.js';
import { RRule } from 'rrule';
import { fetchCalendarObjects, getBasicAuthHeaders } from 'tsdav';

import type { BasicCredentials, DateTimeInterval } from './schema';
import { Temporal } from 'temporal-polyfill';

export function CalDavCalendar(options: {
  calendarId: string;
  serverUrl: string;
  credentials: BasicCredentials;
}) {
  async function getBusyIntervals(
    interval: DateTimeInterval,
  ): Promise<DateTimeInterval[]> {
    const dateFrom = interval.from.toInstant().toString();
    const dateTo = interval.until.toInstant().toString();

    const busyIntervals: DateTimeInterval[] = [];

    const headers = getBasicAuthHeaders(options.credentials);

    const davObjects = await fetchCalendarObjects({
      urlFilter: (url: string) => url.endsWith('.ics'),
      calendar: {
        url: options.calendarId,
      },
      headers,
      expand: true,
      timeRange: {
        start: dateFrom,
        end: dateTo,
      },
    });

    const timeZone = Temporal.Now.timeZone();

    davObjects.forEach((davObject) => {
      if (davObject.data === null || JSON.stringify(davObject.data) === '{}') {
        return;
      }

      const iCalData = ICAL.parse(davObject.data);
      const vCalendar = new ICAL.Component(iCalData);
      const vEvent = vCalendar.getFirstSubcomponent('vevent');

      // Apparently this filters out free status events, though it seems iCloud Calendar doesn't support it
      if (!vEvent || vEvent.getFirstPropertyValue('transp') === 'TRANSPARENT') {
        return;
      }

      const event = new ICAL.Event(vEvent);

      const from = Temporal.ZonedDateTime.from({
        day: event.startDate.day,
        month: event.startDate.month,
        year: event.startDate.year,
        hour: event.startDate.hour,
        minute: event.startDate.minute,
        second: event.startDate.second,
        timeZone: event.startDate.timezone,
      }).withTimeZone(timeZone);
      const until = Temporal.ZonedDateTime.from({
        day: event.endDate.day,
        month: event.endDate.month,
        year: event.endDate.year,
        hour: event.endDate.hour,
        minute: event.endDate.minute,
        second: event.endDate.second,
        timeZone: event.endDate.timezone,
      }).withTimeZone(timeZone);

      // ICAL is a mess, recurring rules are hell
      const vCalendarProperties = vCalendar.getAllProperties();
      const rRuleProperty = vCalendarProperties.find((property) => {
        return ['rrule', 'x-masterrrule', 'x-master-rrule'].includes(
          property.name,
        );
      });
      if (rRuleProperty) {
        const options = RRule.parseString(
          rRuleProperty.getFirstValue().replace(/\\([;,])/g, '$1'),
        );
        options.dtstart = new Date(from.epochMilliseconds);
        const rRule = new RRule(options);
        const duration =
          (event.endDate.toUnixTime() - event.startDate.toUnixTime()) * 1000;
        rRule
          .all((date) => date.valueOf() <= interval.until.epochMilliseconds)
          .forEach((date) => {
            busyIntervals.push({
              from: Temporal.Instant.fromEpochMilliseconds(
                date.getTime(),
              ).toZonedDateTimeISO(timeZone),
              until: Temporal.Instant.fromEpochMilliseconds(
                date.getTime() + duration,
              ).toZonedDateTimeISO(timeZone),
            });
          });
      } else {
        busyIntervals.push({
          from,
          until,
        });
      }
    });

    return busyIntervals;
  }

  return {
    getBusyIntervals,
  };
}
