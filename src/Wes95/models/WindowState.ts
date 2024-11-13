import { z } from 'zod';
import { RectSchema, SizeSchema } from './Geometry';

export const WindowStateSchema = z.object({
  id: z.string(),
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
