import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './router';

console.log(import.meta.env);

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.SITE + '/api/trpc',
    }),
  ],
});

export { trpc };
