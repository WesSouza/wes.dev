import { Temporal } from 'temporal-polyfill';
import type { APIRoute } from 'astro';

import { getBusyTimes } from '../../modules/wescal/backend';
import { WesCalConfigSchema } from '../../modules/wescal/lib/schema';
import { VercelConfig } from '../../utils/vercel-edgeconfig-encrypted';

const timeZone = 'America/New_York';
const maxDays = 14;

export const GET: APIRoute = async function get() {
  const today = Temporal.Now.instant().toZonedDateTimeISO(timeZone);
  const from = today;
  const until = today
    .toPlainDate()
    .add({ days: maxDays })
    .toZonedDateTime({ plainTime: '23:59:59', timeZone });

  const interval = {
    from,
    until,
  };

  const config = await VercelConfig({
    key: import.meta.env.WESCAL_VERCEL_EDGE_CONFIG_KEY,
    secret: import.meta.env.WESCAL_SECRET,
    schema: WesCalConfigSchema,
    vercelEdgeConfigUrl: import.meta.env.EDGE_CONFIG,
    vercelEdgeConfigId: import.meta.env.WESCAL_VERCEL_EDGE_CONFIG_ID,
    vercelApiToken: import.meta.env.WESCAL_VERCEL_API_TOKEN,
  });

  const busyTimes = await getBusyTimes({
    calendars: config.data.calendars,
    google: {
      clientId: import.meta.env.WESCAL_GOOGLE_CALENDAR_CLIENT_ID,
      clientSecret: import.meta.env.WESCAL_GOOGLE_CALENDAR_CLIENT_SECRET,
      redirectUri: import.meta.env.WESCAL_GOOGLE_CALENDAR_REDIRECT_URI,
      onCredentialRefresh: async (credentials) => {
        config.data.calendars.forEach((calendar) => {
          if (calendar.type === 'googlecalendar') {
            calendar.auth = credentials;
          }
        });
        await config.set(config.data);
      },
    },
    interval,
  });

  return new Response(
    JSON.stringify({
      busyTimes,
    }),
    {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
        'Content-Type': 'application/json',
      },
    },
  );
};
