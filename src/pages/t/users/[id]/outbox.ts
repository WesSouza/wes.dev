import type { APIRoute } from 'astro';

import { emptyOrderedCollection } from './_placeholders';

export const GET: APIRoute = async function get({ params, redirect, request }) {
  const { id } = params;

  console.log(request.url, request.headers);

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
    return redirect(`/t/@${id}/followers`, 302);
  }

  return emptyOrderedCollection('/t/users/wes/outbox', request);
};

export const POST: APIRoute = async function post({ request }) {
  console.log(request.url, request.headers);

  return new Response(null, {
    status: 405,
    statusText: 'Method Not Allowed',
  });
};
