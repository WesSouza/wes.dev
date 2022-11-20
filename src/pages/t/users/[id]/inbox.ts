import type { APIRoute } from 'astro';

export const get: APIRoute = async function get({
  params,
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
    return new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed',
    });
  }

  const url = new URL(urlString);
  const page = url.searchParams.get('page');

  if (!page) {
    return new Response(
      JSON.stringify({
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://wes.dev/t/users/wes/inbox',
        type: 'OrderedCollection',
        totalItems: 0,
        first: 'https://wes.dev/t/users/wes/inbox?page=1',
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
      id: 'https://wes.dev/t/users/wes/inbox?page=1',
      type: 'OrderedCollectionPage',
      totalItems: 0,
      partOf: 'https://wes.dev/t/users/wes/inbox',
      orderedItems: [],
    }),
    {
      headers: {
        'Content-Type': 'application/activity+json; charset=utf-8',
      },
    },
  );
};

export const post: APIRoute = async function get() {
  return new Response(null, {
    status: 405,
    statusText: 'Method Not Allowed',
  });
};
