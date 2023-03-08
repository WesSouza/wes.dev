import type { APIRoute } from 'astro';

import { getBusyTimes } from '../../modules/wescal';
import { WesCalConfigSchema } from '../../modules/wescal/schema';
import { VercelConfig } from '../../utils/vercel-edgeconfig-encrypted';

export const get: APIRoute = async function get() {
  const now = new Date();
  // Roughly midnight in EST if the server is in UTC
  const from = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    4,
    0,
    0,
  );
  // Roughly one second to midnight + 14 days in EDT if the server is in UTC
  const until = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 15,
    4,
    59,
    59,
  );

  const freeInterval = {
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
    config: config.data,
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
    interval: freeInterval,
  });

  return new Response(
    JSON.stringify({
      busyTimes,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
