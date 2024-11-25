import { Agent } from '@atproto/api';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

const agent = new Agent(new URL('https://public.api.bsky.app'));

export const wes95_bluesky = {
  getAuthorFeed: defineAction({
    input: z.object({
      actor: z.string(),
      filter: z.string().optional(),
      cursor: z.string().optional(),
      limit: z.number().optional(),
    }),
    handler: async (input) => {
      try {
        const { data, success } = await agent.getAuthorFeed(input);
        if (success) {
          return {
            feed: data.feed.map((post) => ({
              uri: post.post.uri,
            })),
            cursor: data.cursor,
          };
        } else {
          return {
            error: 'getAuthorFeed failed',
          };
        }
      } catch (error) {
        console.error(error);
        return {
          error: 'getAuthorFeed failed',
        };
      }
    },
  }),
  getProfile: defineAction({
    input: z.object({
      actor: z.string(),
    }),
    handler: async (input) => {
      const { data, success } = await agent.getProfile(input);
      if (success) {
        return {
          data: {
            displayName: data.displayName,
          },
        };
      } else {
        return {
          error: 'getProfile failed',
        };
      }
    },
  }),
};
