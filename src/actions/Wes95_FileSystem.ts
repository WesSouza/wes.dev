import { defineAction } from 'astro:actions';
import { getCollection, getEntry } from 'astro:content';
import { z } from 'astro:schema';
import type { AstroContentEntry } from '../Wes95/models/AstroContent';

export const wes95_fileSystem = {
  getCollection: defineAction({
    input: z.object({ type: z.enum(['blog', 'documents']) }),
    handler: async (input) => {
      const content = await getCollection(input.type);
      return content.map((item) => ({
        id: item.id,
        collection: item.collection,
        data: item.data,
        slug: item.slug,
      }));
    },
  }),

  getCollections: defineAction({
    input: z.object({ types: z.array(z.enum(['blog', 'documents'])) }),
    handler: async (input) => {
      let result: AstroContentEntry[] = [];

      for (const type of input.types) {
        const content = await getCollection(type);
        result = result.concat(
          content.map((item) => ({
            id: item.id,
            collection: item.collection,
            data: item.data,
            slug: item.slug,
          })),
        );
      }

      return result;
    },
  }),

  getEntry: defineAction({
    input: z.object({ type: z.enum(['blog', 'documents']), id: z.string() }),
    handler: async (input) => {
      const content = await getEntry(input.type, input.id);
      if (!content) {
        return null;
      }

      return {
        id: content.id,
        body: content.body,
        collection: content.collection,
        data: content.data,
        slug: content.slug,
      };
    },
  }),
};
