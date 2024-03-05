import type { APIRoute } from 'astro';

export const GET: APIRoute = async function get({ redirect, request }) {
  const userAgent = request.headers.get('user-agent');
  if (userAgent?.startsWith('Twitterbot/')) {
    // Go suck a sugar cane field of dick, Twitter bot
    return new Response(
      '<title>Continue on Mastodon</title><a href="https://mastodon.social/@wessouza/">https://mastodon.social/@wessouza/</a>',
    );
  }

  return redirect('https://mastodon.social/@wessouza/', 302);
};
