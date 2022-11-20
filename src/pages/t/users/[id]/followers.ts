import type { APIRoute } from 'astro';

export const get: APIRoute = async function get({
  params,
  redirect,
  request: { headers, url: urlString },
}) {
  const { id } = params;

  if (id !== 'wes') {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const acceptList = (headers.get('Accept') ?? '').split(/\s*,\s*/);
  if (
    !acceptList.some((accept) => accept.startsWith('application/activity+json'))
  ) {
    return redirect(`/t/@${id}/followers`, 302);
  }

  const url = new URL(urlString);
  const page = url.searchParams.get('page');

  if (!page) {
    return new Response(
      JSON.stringify({
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://wes.dev/t/users/wes/followers',
        type: 'OrderedCollection',
        totalItems: 0,
        first: 'https://wes.dev/t/users/wes/followers?page=1',
      }),
      {
        headers: {
          'Content-Type': 'application/activity+json; charset=utf-8',
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: 'https://wes.dev/t/users/wes/followers?page=1',
      type: 'OrderedCollectionPage',
      totalItems: 0,
      partOf: 'https://wes.dev/t/users/wes/followers',
      orderedItems: [],
    }),
    {
      headers: {
        'Content-Type': 'application/activity+json; charset=utf-8',
      },
    },
  );
};
