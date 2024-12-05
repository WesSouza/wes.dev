import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;

export const appRouter = t.router({
  test: t.router({
    getTest: publicProcedure.input(z.string()).query(async ({ input }) => {
      throw new Error();
      return `test ${input}`;
    }),
  }),
});

export type AppRouter = typeof appRouter;
