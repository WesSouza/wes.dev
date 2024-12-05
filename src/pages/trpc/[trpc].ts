import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { APIRoute } from 'astro';
import { createContext } from '../../server/context';
import { appRouter } from '../../server/router';

export const all: APIRoute = (apiContext) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: apiContext.request,
    router: appRouter,
    createContext,
    onError: (opts) => {
      console.error(opts);
    },
  });
};
