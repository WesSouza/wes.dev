import { z } from 'zod';
import { SizeSchema } from './Geometry';

export const WindowStateSchema = z.object({
  id: z.string(),
  centerToParent: z.boolean().optional(),
  centerToScreen: z.boolean().optional(),
  dataSchema: z.instanceof(z.ZodObject),
  height: z.number(),
  icon: z.string().optional(),
  maximizable: z.boolean().optional(),
  maximized: z.boolean().optional(),
  minimizable: z.boolean().optional(),
  minimized: z.boolean().optional(),
  parentId: z.string().optional(),
  showInTaskbar: z.boolean().default(false),
  sizeAutomatic: z.boolean().optional(),
  sizeConstraints: z.object({
    max: SizeSchema.optional(),
    min: SizeSchema.optional(),
  }),
  title: z.string(),
  url: z.string(),
  width: z.number(),
  x: z.number(),
  y: z.number(),
});

export type WindowState = z.infer<typeof WindowStateSchema>;
