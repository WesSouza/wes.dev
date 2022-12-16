import type { APIRoute } from 'astro';

export const get: APIRoute = async function get({ params, redirect, request }) {
  const { id } = params;

  if (typeof id !== 'string' || !id.match(/^\d+$/)) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const userAgent = request.headers.get('user-agent');
  if (userAgent?.startsWith('Twitterbot/')) {
    // Go suck a sugar cane field of dick, Twitter bot
    return { body: '<title>Continue reading on Mastodon</title>' };
  }

  return redirect(`https://mastodon.social/@wessouza/${id}`, 302);
};
