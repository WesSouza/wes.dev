import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
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
  loader: glob({ base: './src/content/documents', pattern: '**/*.md' }),
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
