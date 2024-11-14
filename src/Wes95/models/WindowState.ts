import { z } from 'zod';
import { RectSchema, SizeSchema } from './Geometry';

export const WindowStateSchema = z.object({
  id: z.string(),
  icon: z.string().optional(),
  maximized: z.boolean().optional(),
  minimized: z.boolean().optional(),
  parentId: z.string().optional(),
  rect: RectSchema,
  sizeConstraints: z
    .object({
      max: SizeSchema.optional(),
      min: SizeSchema.optional(),
    })
    .optional(),
  showInTaskbar: z.boolean().default(false),
  title: z.string(),
  url: z.string(),
});

export type WindowState = z.infer<typeof WindowStateSchema>;
