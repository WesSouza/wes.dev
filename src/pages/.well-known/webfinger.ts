import type { APIRoute } from 'astro';

import { SITE_DOMAIN } from '../../config';

export const GET: APIRoute = async function get({ request }) {
  const url = new URL(request.url);
  const resource = url.searchParams.get('resource');

  console.log(request.url, request.headers);

  if (resource !== `acct:wes@${SITE_DOMAIN}`) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return new Response(
    JSON.stringify({
      subject: `acct:wes@${SITE_DOMAIN}`,
      aliases: [
        `https://${SITE_DOMAIN}/t/@wes`,
        `https://${SITE_DOMAIN}/t/users/wes`,
      ],
      links: [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          type: 'text/html',
          href: `https://${SITE_DOMAIN}/t/@wes`,
        },
        {
          rel: 'self',
          type: 'application/activity+json',
          href: `https://${SITE_DOMAIN}/t/users/wes`,
        },
        {
          rel: 'http://ostatus.org/schema/1.0/subscribe',
          template: `https://${SITE_DOMAIN}/t/authorize_interaction?uri={uri}`,
        },
      ],
    }),
    {
      headers: {
        'Content-Type': 'application/jrd+json; charset=utf-8',
      },
    },
  );
};
