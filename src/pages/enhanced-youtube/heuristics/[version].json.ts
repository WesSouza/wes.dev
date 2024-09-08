import type { APIRoute } from 'astro';

import Heuristics_2 from './_heuristics_2.json';
import Heuristics_3 from './_heuristics_3.json';

export const GET: APIRoute<
  Record<string, unknown>,
  { version: string }
> = async function get({ params }) {
  const { version } = params;
  const [, buildString] = version.split('_');
  const build = buildString ? parseInt(buildString, 10) : 0;

  let heuristics: unknown;

  if (build >= 18) {
    heuristics = Heuristics_3;
  } else {
    heuristics = Heuristics_2;
  }

  return new Response(JSON.stringify(heuristics), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=60',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
