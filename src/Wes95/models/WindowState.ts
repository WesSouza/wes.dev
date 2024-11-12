import { z } from 'zod';

export const WindowStateSchema = z.object({
  id: z.string(),
  parentId: z.string().optional(),
  showInTaskbar: z.boolean().default(false),
  title: z.string(),
  url: z.string(),
});

export type WindowState = z.infer<typeof WindowStateSchema>;
