import type { APIRoute } from 'astro';
import { google } from 'googleapis';

import { GoogleCredentialsSchema } from '../../modules/wescal/lib/google-calendar';
import { WesCalConfigSchema } from '../../modules/wescal/lib/schema';
import { VercelConfig } from '../../utils/vercel-edgeconfig-encrypted';

export const GET: APIRoute = async function get({ url }) {
  const code = url.searchParams.get('code');
  if (typeof code !== 'string') {
    throw new Error('Missing code query parameter');
  }

  const oAuth2Client = new google.auth.OAuth2(
    import.meta.env.WESCAL_GOOGLE_CALENDAR_CLIENT_ID,
    import.meta.env.WESCAL_GOOGLE_CALENDAR_CLIENT_SECRET,
    import.meta.env.WESCAL_GOOGLE_CALENDAR_REDIRECT_URI,
  );

  const { tokens } = await oAuth2Client.getToken(code);

  const credentials = GoogleCredentialsSchema.parse(tokens);

  oAuth2Client.setCredentials(credentials);

  const people = google.people({
    version: 'v1',
    auth: oAuth2Client,
  });

  const res = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses',
  });

  if (
    res.data.emailAddresses?.[0]?.value !==
    import.meta.env.WESCAL_GOOGLE_CALENDAR_EMAIL
  ) {
    throw new Error("You're not my real mother!");
  }

  const config = await VercelConfig({
    key: import.meta.env.WESCAL_VERCEL_EDGE_CONFIG_KEY,
    secret: import.meta.env.WESCAL_SECRET,
    schema: WesCalConfigSchema,
    vercelEdgeConfigUrl: import.meta.env.EDGE_CONFIG,
    vercelEdgeConfigId: import.meta.env.WESCAL_VERCEL_EDGE_CONFIG_ID,
    vercelApiToken: import.meta.env.WESCAL_VERCEL_API_TOKEN,
  });

  config.data.calendars.forEach((calendar) => {
    if (calendar.type === 'googlecalendar') {
      calendar.auth = credentials;
    }
  });
  await config.set(config.data);

  return new Response('OK');
};
