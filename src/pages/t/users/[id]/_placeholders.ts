import { SITE_DOMAIN } from '../../../../config';

export function emptyOrderedCollection(path: string, request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');

  if (!page) {
    return new Response(
      JSON.stringify({
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `https://${SITE_DOMAIN}${path}/inbox`,
        type: 'OrderedCollection',
        totalItems: 0,
        first: `https://${SITE_DOMAIN}${path}/inbox?page=1`,
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
      id: `https://${SITE_DOMAIN}${path}/inbox?page=1`,
      type: 'OrderedCollectionPage',
      totalItems: 0,
      partOf: `https://${SITE_DOMAIN}${path}/inbox`,
      orderedItems: [],
    }),
    {
      headers: {
        'Content-Type': 'application/activity+json; charset=utf-8',
      },
    },
  );
}
