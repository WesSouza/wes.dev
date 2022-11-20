import type { APIRoute } from 'astro';

export const get: APIRoute = async function get({
  request: { url: urlString },
}) {
  const url = new URL(urlString);
  const resource = url.searchParams.get('resource');

  if (resource !== 'acct:wes@wes.dev') {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return new Response(
    JSON.stringify({
      subject: 'acct:wes@wes.dev',
      aliases: ['https://wes.dev/t/@wes', 'https://wes.dev/t/users/wes'],
      links: [
        {
          rel: 'http://webfinger.net/rel/profile-page',
          type: 'text/html',
          href: 'https://wes.dev/t/@wes',
        },
        {
          rel: 'self',
          type: 'application/activity+json',
          href: 'https://wes.dev/t/users/wes',
        },
        {
          rel: 'http://ostatus.org/schema/1.0/subscribe',
          template: 'https://wes.dev/t/authorize_interaction?uri={uri}',
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
