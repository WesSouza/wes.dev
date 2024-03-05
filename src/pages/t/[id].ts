import type { APIRoute } from 'astro';

export const GET: APIRoute = async function get({ params, redirect, request }) {
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
    return new Response(
      `<title>Continue on Mastodon</title><a href="https://mastodon.social/@wessouza/${id}">https://mastodon.social/@wessouza/${id}</a>`,
    );
  }

  return redirect(`https://mastodon.social/@wessouza/${id}`, 302);
};
