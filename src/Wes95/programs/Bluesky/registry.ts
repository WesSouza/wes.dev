import { z } from 'zod';

export const BlueskyProfileDataSchema = z.object({
  did: z.string().optional(),
});

export type BlueskyProfileData = z.infer<typeof BlueskyProfileDataSchema>;

export const BlueskyUserListDataSchema = z.object({
  did: z.string(),
  type: z.enum(['follows', 'followers']),
});

export type BlueskyUserListData = z.infer<typeof BlueskyUserListDataSchema>;

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
      UserList: {
        async: true,
        schema: BlueskyUserListDataSchema,
        window: async () => ({
          default: (await import('./UserListWindow')).BlueskyUserListWindow,
        }),
      },
    },
  };
}
