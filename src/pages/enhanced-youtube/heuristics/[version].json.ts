import type { APIRoute } from 'astro';

import Heuristics_1 from './_heuristics_1.json';

export const GET: APIRoute<
  Record<string, unknown>,
  { version: string }
> = async function get({ params }) {
  const { version: _version } = params;

  return new Response(JSON.stringify(Heuristics_1), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=60',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
