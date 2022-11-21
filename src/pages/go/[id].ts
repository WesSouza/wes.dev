import type { APIRoute } from 'astro';

import { SITE_ARTICLES } from '../../config';

export const get: APIRoute = async function get({ params, redirect }) {
  const { id } = params;
  const link = SITE_ARTICLES.find((article) => article.goSlug === id);

  if (!link) {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return redirect(link.href, 301);
};
