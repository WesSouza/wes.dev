import { google } from 'googleapis';
import { Temporal } from 'temporal-polyfill';
import { z } from 'zod';

import type { DateTimeInterval } from './schema';

export const GoogleCredentialsSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.literal('Bearer'),
  expiry_date: z.number().positive(),
});

export type GoogleCredentials = z.infer<typeof GoogleCredentialsSchema>;

export type GoogleCalendarProps = {
  calendarId: string;
  clientId: string;
  clientSecret: string;
  credentials: GoogleCredentials;
  redirectUri: string;
  onCredentialRefresh?:
    | ((credentials: GoogleCredentials) => Promise<void>)
    | undefined;
};

export function GoogleCalendar(options: GoogleCalendarProps) {
  async function getAuth() {
    const oAuth2Client = new google.auth.OAuth2(
      options.clientId,
      options.clientSecret,
      options.redirectUri,
    );

    oAuth2Client.setCredentials(options.credentials);

    if (options.credentials.expiry_date < Date.now() + 60000) {
      const refreshedAuth = await oAuth2Client.refreshAccessToken();
      const newCredentials = GoogleCredentialsSchema.parse(
        refreshedAuth.credentials,
      );
      if (options.onCredentialRefresh) {
        await options.onCredentialRefresh(newCredentials);
      }
      oAuth2Client.setCredentials(newCredentials);
    }

    return oAuth2Client;
  }

  async function getBusyIntervals(
    interval: DateTimeInterval,
  ): Promise<DateTimeInterval[]> {
    const auth = await getAuth();

    const gcal = google.calendar({
      version: 'v3',
      auth,
    });

    const eventsResponse = await gcal.events.list({
      calendarId: options.calendarId,
      singleEvents: true,
      timeMin: interval.from.toInstant().toString(),
      timeMax: interval.until.toInstant().toString(),
    });

    if (!eventsResponse.data || !eventsResponse.data.items) {
      console.error(
        `Invalid Google Calendar response: ${eventsResponse.status} ${eventsResponse.statusText}`,
      );
      throw new Error('Invalid Google Calendar response');
    }

    const timeZone = Temporal.Now.timeZone();

    return eventsResponse.data.items
      .filter(
        (event) =>
          event.status !== 'cancelled' &&
          event.transparency !== 'transparent' &&
          event.eventType !== 'outOfOffice' &&
          event.start?.dateTime &&
          event.end?.dateTime &&
          (!event.attendees ||
            event.attendees.find((attendee) => attendee.self)
              ?.responseStatus !== 'declined'),
      )
      .map((event) => ({
        from: Temporal.Instant.from(
          event.start?.dateTime as string,
        ).toZonedDateTimeISO(timeZone),
        until: Temporal.Instant.from(
          event.end?.dateTime as string,
        ).toZonedDateTimeISO(timeZone),
      }));
  }

  return {
    getBusyIntervals,
  };
}
