import { z } from 'zod';
import { GoogleCredentialsSchema } from './calendars/google-calendar';

export const BasicCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type BasicCredentials = z.infer<typeof BasicCredentialsSchema>;

export type CalendarDay = {
  year: number;
  month: number;
  day: number;
};

export type CalendarDayMeta = {
  disabled: boolean;
  weekend: boolean;
  label: string;
  day: CalendarDay;
  from: Date;
  until: Date;
  availableFrom: Date;
  availableUntil: Date;
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

export const TimeIntervalSchema = z.object({
  from: z.date(),
  until: z.date(),
});

export type TimeInterval = z.infer<typeof TimeIntervalSchema>;

export const WesCalConfigSchema = z.object({
  calendars: z.array(CalendarConfigSchema),
});

export type WesCalConfig = z.infer<typeof WesCalConfigSchema>;
