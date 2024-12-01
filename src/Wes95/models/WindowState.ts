import { z } from 'zod';
import { SizeSchema } from './Geometry';

export const WindowStateSchema = z.object({
  // System
  id: z.string(),
  dataSchema: z.instanceof(z.ZodObject),
  initialized: z.boolean().default(false),
  parentId: z.string().optional(),
  showInTaskbar: z.boolean().default(false),
  url: z.string(),

  // Title
  icon: z.string().optional(),
  title: z.string(),

  // Sizing and Positioning
  centerToParent: z.boolean().optional(),
  centerToScreen: z.boolean().optional(),
  height: z.number(),
  maximizable: z.boolean().optional(),
  maximized: z.boolean().optional(),
  minimizable: z.boolean().optional(),
  minimized: z.boolean().optional(),
  sizeAutomatic: z.boolean().optional(),
  sizeConstraints: z.object({
    max: SizeSchema.partial().optional(),
    min: SizeSchema.partial().optional(),
  }),
  width: z.number(),
  x: z.number(),
  y: z.number(),
});

export type WindowState = z.infer<typeof WindowStateSchema>;
