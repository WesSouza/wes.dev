import { google } from 'googleapis';
import { z } from 'zod';
import type { TimeInterval } from '../schema';

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
    interval: TimeInterval,
  ): Promise<TimeInterval[]> {
    const auth = await getAuth();

    const gcal = google.calendar({
      version: 'v3',
      auth,
    });

    const eventsResponse = await gcal.events.list({
      calendarId: options.calendarId,
      singleEvents: true,
      timeMin: interval.from.toISOString(),
      timeMax: interval.until.toISOString(),
    });

    if (!eventsResponse.data || !eventsResponse.data.items) {
      console.error(
        `Invalid Google Calendar response: ${eventsResponse.status} ${eventsResponse.statusText}`,
      );
      throw new Error('Invalid Google Calendar response');
    }

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
        from: new Date(event.start?.dateTime as string),
        until: new Date(event.end?.dateTime as string),
      }));
  }

  return {
    getBusyIntervals,
  };
}
