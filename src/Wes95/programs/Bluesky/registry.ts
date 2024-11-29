import { z } from 'zod';

export const BlueskyProfileDataSchema = z.object({
  did: z.string().optional(),
});

export type BlueskyProfileData = z.infer<typeof BlueskyProfileDataSchema>;

export function registerBluesky() {
  return {
    name: 'Bluesky',
    windows: {
      Profile: {
        async: true,
        schema: BlueskyProfileDataSchema,
        window: async () => ({
          default: (await import('./ProfileWindow')).BlueskyProfileWindow,
        }),
      },
    },
  };
}
