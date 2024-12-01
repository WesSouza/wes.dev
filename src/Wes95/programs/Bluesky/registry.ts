import { z } from 'zod';

export const BlueskyProfileDataSchema = z.object({
  did: z.string().optional(),
});

export type BlueskyProfileData = z.infer<typeof BlueskyProfileDataSchema>;

export const BlueskyPostSearchDataSchema = z.object({
  q: z.string(),
});

export type BlueskyPostSearchData = z.infer<typeof BlueskyPostSearchDataSchema>;

export const BlueskyPostThreadDataSchema = z.object({
  uri: z.string(),
});

export type BlueskyPostThreadData = z.infer<typeof BlueskyPostThreadDataSchema>;

export const BlueskySearchDialogDataSchema = z.object({
  delegateId: z.string(),
  q: z.string().optional(),
});

export type BlueskySearchDialogData = z.infer<
  typeof BlueskySearchDialogDataSchema
>;

export const BlueskySearchDialogEventSchema = z
  .object({
    q: z.string().optional(),
  })
  .brand<'Bluesky/SearchDialogEvent'>();

export type BlueskySearchDialogEvent = z.infer<
  typeof BlueskySearchDialogEventSchema
>;

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
      PostSearch: {
        async: true,
        schema: BlueskyPostSearchDataSchema,
        window: async () => ({
          default: (await import('./PostSearchWindow')).BlueskyPostSearchWindow,
        }),
      },
      PostThread: {
        async: true,
        schema: BlueskyPostThreadDataSchema,
        window: async () => ({
          default: (await import('./PostThreadWindow')).BlueskyPostThreadWindow,
        }),
      },
      SearchDialog: {
        async: true,
        schema: BlueskySearchDialogDataSchema,
        window: async () => ({
          default: (await import('./SearchDialogWindow'))
            .BlueskySearchDialogWindow,
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
