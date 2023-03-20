import ICAL from 'ical.js';
import { RRule } from 'rrule';
import { fetchCalendarObjects, getBasicAuthHeaders } from 'tsdav';

import type { BasicCredentials, DateTimeInterval } from '../schema';
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
        options.dtstart = event.startDate.toJSDate();
        const rRule = new RRule(options);
        const duration =
          (event.endDate.toUnixTime() - event.startDate.toUnixTime()) * 1000;
        rRule
          .all((date) => date.valueOf() <= interval.until.epochMilliseconds)
          .forEach((date) => {
            busyIntervals.push({
              from: Temporal.Instant.fromEpochMilliseconds(
                date.getTime(),
              ).toZonedDateTimeISO(event.startDate.timezone),
              until: Temporal.Instant.fromEpochMilliseconds(
                date.getTime() + duration,
              ).toZonedDateTimeISO(event.endDate.timezone),
            });
          });
      } else {
        busyIntervals.push({
          from: Temporal.Instant.fromEpochSeconds(
            event.startDate.toUnixTime(),
          ).toZonedDateTimeISO(event.startDate.timezone),
          until: Temporal.Instant.fromEpochSeconds(
            event.endDate.toUnixTime(),
          ).toZonedDateTimeISO(event.endDate.timezone),
        });
      }
    });

    return busyIntervals;
  }

  return {
    getBusyIntervals,
  };
}
