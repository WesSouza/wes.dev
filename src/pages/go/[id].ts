import type { APIRoute } from 'astro';

import { SITE_GO_LINKS } from '../../config';

export const GET: APIRoute = async function get({ params, redirect, request }) {
  const { id } = params;
  const link = SITE_GO_LINKS.find((article) => article.goSlug === id);

  if (!link) {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const userAgent = request.headers.get('user-agent');
  if (userAgent?.startsWith('Twitterbot/')) {
    // Twitter likes to block things, let's prevent it from doing so
    return new Response(`<a href="${link.href}">Continue to ${link.href}</a>`);
  }

  return redirect(link.href, 301);
};
