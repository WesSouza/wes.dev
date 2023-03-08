import ICAL from 'ical.js';
import { RRule } from 'rrule';
import { fetchCalendarObjects, getBasicAuthHeaders } from 'tsdav';

import type { BasicCredentials, TimeInterval } from '../schema';

export function CalDavCalendar(options: {
  calendarId: string;
  serverUrl: string;
  credentials: BasicCredentials;
}) {
  async function getBusyIntervals(
    interval: TimeInterval,
  ): Promise<TimeInterval[]> {
    const dateFrom = interval.from.toISOString();
    const dateTo = interval.until.toISOString();

    const busyIntervals: TimeInterval[] = [];

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
          .all((date) => date <= interval.until)
          .forEach((date) => {
            busyIntervals.push({
              from: date,
              until: new Date(date.getTime() + duration),
            });
          });
      } else {
        busyIntervals.push({
          from: event.startDate.toJSDate(),
          until: event.endDate.toJSDate(),
        });
      }
    });

    return busyIntervals;
  }

  return {
    getBusyIntervals,
  };
}
