import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { APIRoute } from 'astro';
import { createContext } from '../../../trpc/context';
import { appRouter } from '../../../trpc/router';

export const ALL: APIRoute = (apiContext) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: apiContext.request,
    router: appRouter,
    createContext,
    responseMeta(opts) {
      const { errors, type } = opts;

      const allOk = errors.length === 0;
      const isQuery = type === 'query';

      if (allOk && isQuery) {
        return {
          headers: {
            'cache-control': `s-maxage=60, stale-while-revalidate=600`,
          },
        };
      }

      return {};
    },
  });
};
