import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.SITE + '/api/trpc',
    }),
  ],
});

export { trpc };
