import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    published: z.boolean().optional(),
    wes95_file: z.string(),
  }),
});

const documentsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
    wes95_file: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
  documents: documentsCollection,
};
