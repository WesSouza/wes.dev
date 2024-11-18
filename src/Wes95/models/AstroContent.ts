import { z } from 'zod';

export const AstroContentEntrySchema = z.object({
  id: z.string(),
  collection: z.enum(['blog', 'documents']),
  data: z.object({
    date: z.string().optional(),
    description: z.string().optional(),
    title: z.string().optional(),
    wes95_file: z.string(),
  }),
  slug: z.string(),
});

export type AstroContentEntry = z.infer<typeof AstroContentEntrySchema>;

export const AstroContentEntryDataSchema = z.object({
  id: z.string(),
  body: z.string(),
});

export type AstroContentEntryData = z.infer<typeof AstroContentEntryDataSchema>;
