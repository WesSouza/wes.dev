import type { APIRoute } from 'astro';

const links: Record<string, string> = {
  'components-talk':
    'https://dev.to/wes/bringing-components-to-legacy-code-2m00',
  'cool-things': 'https://dev.to/wes/cool-things-make-people-happy-3pci',
  'front-end': 'https://dev.to/wes/keeping-control-of-the-front-end-ag7',
  'immer-state': 'https://dev.to/wes/simple-react-state-management-29g',
  'pull-request': 'https://dev.to/wes/opening-a-pr-a-primer-4kgc',
  'trpc-talk':
    'https://dev.to/wes/trpc-move-fast-and-break-nothing-usereactnyc-3g08',
  'web-developer':
    'https://dev.to/wes/why-i-became-and-still-am-a-web-developer-1k3',
};

export const get: APIRoute = async function get({ params, redirect }) {
  const { id } = params;
  const link = typeof id === 'string' ? links[id] : null;

  if (!link) {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return redirect(link, 301);
};
