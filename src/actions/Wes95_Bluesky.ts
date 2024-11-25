import { Agent } from '@atproto/api';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  Bluesky_Actor_ProfileViewDetailedSchema,
  Bluesky_Feed_ViewPostSchema,
} from '../Wes95/models/Bluesky';

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
      const { data } = await agent.getAuthorFeed(input);

      const AuthorFeedSchema = z.object({
        feed: z.array(Bluesky_Feed_ViewPostSchema),
        cursor: z.string().optional(),
      });

      return AuthorFeedSchema.parse(data);
    },
  }),
  getProfile: defineAction({
    input: z.object({
      actor: z.string(),
    }),
    handler: async (input) => {
      const { data } = await agent.getProfile(input);
      return Bluesky_Actor_ProfileViewDetailedSchema.parse(data);
    },
  }),
};
