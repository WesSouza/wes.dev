import type { APIRoute } from 'astro';

export const GET: APIRoute = async function get({
  params,
  redirect,
  request: { headers },
}) {
  const { id } = params;

  if (id !== 'wes') {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const acceptList = (headers.get('Accept') ?? '').split(/\s*,\s*/);
  if (
    acceptList.some((accept) => accept.startsWith('application/activity+json'))
  ) {
    return redirect(`/t/users/${id}/followers`, 302);
  }

  return redirect('/t/fail-mammoth', 302);
};
