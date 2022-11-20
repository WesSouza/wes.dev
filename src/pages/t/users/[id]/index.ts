import type { APIRoute } from 'astro';

export const get: APIRoute = async function get({
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
    !acceptList.some((accept) => accept.startsWith('application/activity+json'))
  ) {
    return redirect(`/t/@${id}`, 302);
  }

  return new Response(
    JSON.stringify({
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        'https://w3id.org/security/v1',
        {
          toot: 'http://joinmastodon.org/ns#',
          schema: 'http://schema.org#',
          discoverable: 'toot:discoverable',
        },
      ],
      id: 'https://wes.dev/t/users/wes',
      type: 'Person',
      following: 'https://wes.dev/t/users/wes/following',
      followers: 'https://wes.dev/t/users/wes/followers',
      inbox: 'https://wes.dev/t/users/wes/inbox',
      outbox: 'https://wes.dev/t/users/wes/outbox',
      preferredUsername: 'wes',
      name: 'Wes Souza',
      summary:
        '\u003cp\u003eStaff Software Engineer, creator. He/him.\u003c/p\u003e',
      url: 'https://wes.dev/t/@wes',
      discoverable: true,
      published: '2022-04-26T00:00:00Z',
      publicKey: {
        id: 'https://wes.dev/t/users/wes#main-key',
        owner: 'https://wes.dev/t/users/wes',
        publicKeyPem:
          '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtzLZkjwZ8LlQ/j670bvt\njl1C8somfEY4ZewdpCUEcI5e3GmJSN/uI4Mx9LC5vnaR0SUmOTPWyeF/Unl0CAX/\n7ZlA319ZUAEx5tLhGF9uNQxtQCoYJqdPeMXXPp011pGPnpe3oQx7mfZB2Ggem4o/\nP3Mn+XqS5tMw+p7BHE9IDLoYOBydiGLATmOtcXoTDbTmcy03t1h+/1F+Wzq6wSfS\nGu+blYRV3OxJ/crFYSZvTQMBPgYPko7tZHu6QfQgIEIt/Sx/M8MIDXzFefvcQDr1\ngA8JYafYAcv2uJ2PVf3fDC0BYpFFSBFg/S1I1KUEjxfhJrg7kgUDlow6bGYeYw4p\n+QIDAQAB\n-----END PUBLIC KEY-----\n',
      },
      icon: {
        type: 'Image',
        mediaType: 'image/jpeg',
        url: 'https://files.mastodon.social/accounts/avatars/108/198/221/522/333/432/original/64356ef7cf67fbd2.jpg',
      },
      image: {
        type: 'Image',
        mediaType: 'image/jpeg',
        url: 'https://files.mastodon.social/accounts/headers/108/198/221/522/333/432/original/9a47fa7f0a6025c1.jpeg',
      },
    }),
    {
      headers: {
        'Content-Type': 'application/activity+json; charset=utf-8',
      },
    },
  );
};
