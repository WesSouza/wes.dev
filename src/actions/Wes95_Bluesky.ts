import {
  Agent,
  AppBskyFeedDefs,
  AppBskyFeedGetAuthorFeed,
  AppBskyFeedSearchPosts,
} from '@atproto/api';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import {
  Bluesky_Actor_ProfileViewBasicSchema,
  Bluesky_Actor_ProfileViewDetailedSchema,
} from '../Wes95/models/Bluesky';

const agent = new Agent('https://public.api.bsky.app');

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

      // Use JSON to remove unserializable types
      return JSON.parse(
        JSON.stringify(data),
      ) as AppBskyFeedGetAuthorFeed.OutputSchema;
    },
  }),
  getPostThread: defineAction({
    input: z.object({
      uri: z.string(),
      depth: z.number().optional(),
      parentHeight: z.number().optional(),
    }),
    handler: async (input) => {
      const { data } = await agent.getPostThread(input);

      // Use JSON to remove unserializable types
      return JSON.parse(
        JSON.stringify(data.thread),
      ) as AppBskyFeedDefs.ThreadViewPost;
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
  getUserList: defineAction({
    input: z.object({
      actor: z.string(),
      cursor: z.string().optional(),
      limit: z.number().optional(),
      type: z.enum(['follows', 'followers']),
    }),
    handler: async (input) => {
      const { type, ...restInput } = input;
      const { data } =
        await agent[type === 'follows' ? 'getFollows' : 'getFollowers'](
          restInput,
        );
      return z
        .object({
          cursor: z.string().optional(),
          subject: Bluesky_Actor_ProfileViewBasicSchema,
          users: z.array(Bluesky_Actor_ProfileViewBasicSchema),
        })
        .parse({
          cursor: data.cursor,
          subject: data.subject,
          users: data.followers ?? data.follows,
        });
    },
  }),
  searchPosts: defineAction({
    input: z.object({
      author: z.string().optional(),
      cursor: z.string().optional(),
      domain: z.string().optional(),
      lang: z.string().optional(),
      limit: z.number().optional(),
      mentions: z.string().optional(),
      q: z.string(),
      since: z.string().optional(),
      sort: z.enum(['top', 'latest']).optional(),
      tag: z.array(z.string()).optional(),
      until: z.string().optional(),
      url: z.string().optional(),
    }),
    handler: async (input) => {
      const { data } = await agent.app.bsky.feed.searchPosts(input);
      console.log(data);

      // Use JSON to remove unserializable types
      return JSON.parse(
        JSON.stringify(data),
      ) as AppBskyFeedSearchPosts.OutputSchema;
    },
  }),
};
