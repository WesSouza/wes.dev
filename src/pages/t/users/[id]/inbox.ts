import type { APIRoute } from 'astro';

import { emptyOrderedCollection } from './_placeholders';

export const get: APIRoute = async function get({ params, request }) {
  const { id } = params;

  if (id !== 'wes') {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const acceptList = (request.headers.get('Accept') ?? '').split(/\s*,\s*/);
  if (
    !acceptList.some((accept) => accept.startsWith('application/activity+json'))
  ) {
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed',
    });
  }

  return emptyOrderedCollection('/t/users/wes/inbox', request);
};

export const post: APIRoute = async function get() {
  return new Response(null, {
    status: 405,
    statusText: 'Method Not Allowed',
  });
};
