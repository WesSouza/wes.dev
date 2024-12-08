import { getCollection, getEntry } from 'astro:content';
import { z } from 'astro:schema';
import type { AstroContentEntry } from '../Wes95/models/AstroContent';
import { publicProcedure, t } from './app';

export const wes95_fileSystem = t.router({
  getCollection: publicProcedure
    .input(z.object({ type: z.enum(['blog', 'documents']) }))
    .query(async ({ input }) => {
      const content = await getCollection(input.type);
      return content.map((item) => ({
        id: item.id,
        collection: item.collection,
        data: item.data,
        slug: item.slug,
      }));
    }),

  getCollections: publicProcedure
    .input(z.object({ types: z.array(z.enum(['blog', 'documents'])) }))
    .query(async ({ input }) => {
      let result: AstroContentEntry[] = [];

      for (const type of input.types) {
        const content = await getCollection(type);
        result = result.concat(
          content
            .filter(
              (item) =>
                item.data &&
                (item.collection === 'documents' ||
                  (item.collection === 'blog' && item.data.published)),
            )
            .map((item) => ({
              id: item.id,
              collection: item.collection,
              data: item.data,
              slug: item.slug,
            })),
        );
      }

      return result;
    }),

  getEntry: publicProcedure
    .input(z.object({ type: z.enum(['blog', 'documents']), id: z.string() }))
    .query(async ({ input }) => {
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
    }),
});
