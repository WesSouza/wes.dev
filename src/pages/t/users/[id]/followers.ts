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

  return emptyOrderedCollection('/t/users/wes/followers', request);
};
