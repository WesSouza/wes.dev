import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  return { req, resHeaders };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
