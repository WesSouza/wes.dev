import { z } from 'zod';

export const WindowStateSchema = z.object({
  id: z.string(),
  title: z.string(),
  showInTaskbar: z.boolean().default(false),
  url: z.string(),
});

export type WindowState = z.infer<typeof WindowStateSchema>;
