import { createClient } from '@vercel/edge-config';
import { z, ZodSchema } from 'zod';

import type { AsyncResult } from '../types';
import { createEncryptor } from './simple-encryptor';

export async function VercelConfig<T>({
  key,
  schema,
  secret,
  vercelApiToken,
  vercelEdgeConfigId,
  vercelEdgeConfigUrl,
}: {
  key: string;
  schema: ZodSchema<T>;
  secret: string;
  vercelApiToken?: string | undefined;
  vercelEdgeConfigId?: string;
  vercelEdgeConfigUrl: string;
}) {
  const client = createClient(vercelEdgeConfigUrl);
  const data = await client.get<string>(key);
  if (data === undefined) {
    throw new Error('Vercel Edge Config data is undefined');
  }

  const encryptor = createEncryptor(secret);
  const decrypted = encryptor.decrypt(data);
  let parsed = schema.parse(decrypted);

  return {
    get data() {
      return parsed;
    },

    async set(value: T): AsyncResult<undefined> {
      if (!vercelApiToken || !vercelEdgeConfigId) {
        return {
          success: false,
          error: new Error('Cannot set with missing configuration'),
        };
      }

      try {
        const url = `https://api.vercel.com/v1/edge-config/${vercelEdgeConfigId}/items?teamId=`;
        const encryptedData = encryptor.encrypt(value);

        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            authorization: `Bearer ${vercelApiToken}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            items: [{ operation: 'upsert', key, value: encryptedData }],
          }),
        });

        if (response.status >= 300) {
          console.error(
            `Vercel Edge Config set failed with status ${
              response.status
            }: ${await response.text()}`,
          );
          return {
            success: false,
            error: new Error(
              `Vercel Edge Config set failed with status ${response.status}`,
            ),
          };
        }

        const responseData = await response.json();
        z.object({ status: z.literal('ok') }).parse(responseData);

        parsed = value;
      } catch (error) {
        return {
          success: false,
          error,
        };
      }

      return {
        success: true,
        data: undefined,
      };
    },
  };
}
