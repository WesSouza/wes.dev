import { z } from 'zod';

export type Point = z.infer<typeof PointSchema>;

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Rect = z.infer<typeof RectSchema>;

export const RectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export type Size = z.infer<typeof SizeSchema>;

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export type Anchor = z.infer<typeof AnchorSchema>;

export const AnchorSchema = RectSchema.extend({
  direction: z
    .enum(['block-start', 'block-end', 'inline-start', 'inline-end'])
    .optional(),
});
