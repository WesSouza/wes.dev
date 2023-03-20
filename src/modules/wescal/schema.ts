import { z } from 'zod';
import { GoogleCredentialsSchema } from './calendars/google-calendar';
import type { Temporal } from 'temporal-polyfill';

export const BasicCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type BasicCredentials = z.infer<typeof BasicCredentialsSchema>;

export type CalendarDayMeta = {
  availableFrom: Temporal.PlainTime | undefined;
  availableUntil: Temporal.PlainTime | undefined;
  day: Temporal.PlainDate;
  disabled: boolean;
  label: string;
  weekend: boolean;
};

export const CalendarConfigSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('caldav'),
    serverUrl: z.string(),
    calendarId: z.string(),
    auth: BasicCredentialsSchema,
  }),
  z.object({
    type: z.literal('googlecalendar'),
    calendarId: z.string(),
    auth: GoogleCredentialsSchema,
  }),
]);

export type CalendarConfig = z.infer<typeof CalendarConfigSchema>;

export type DateTimeInterval = {
  from: Temporal.ZonedDateTime;
  until: Temporal.ZonedDateTime;
};

export type PlainTimeInterval = {
  from: Temporal.PlainTime;
  until: Temporal.PlainTime;
};

export type TimeInterval = {
  from: Date;
  until: Date;
};

export const WesCalConfigSchema = z.object({
  calendars: z.array(CalendarConfigSchema),
});

export type WesCalConfig = z.infer<typeof WesCalConfigSchema>;
