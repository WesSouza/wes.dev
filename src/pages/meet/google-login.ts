import type { APIRoute } from 'astro';
import { google } from 'googleapis';

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
];

export const GET: APIRoute = async function get({ redirect }) {
  const oAuth2Client = new google.auth.OAuth2(
    import.meta.env.WESCAL_GOOGLE_CALENDAR_CLIENT_ID,
    import.meta.env.WESCAL_GOOGLE_CALENDAR_CLIENT_SECRET,
    import.meta.env.WESCAL_GOOGLE_CALENDAR_REDIRECT_URI,
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state: 'wescal',
  });

  return redirect(authUrl);
};
