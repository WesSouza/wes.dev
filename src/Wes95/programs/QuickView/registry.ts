import { z } from 'zod';
import { QuickViewMainWindow } from './MainWindow';
import type { ProgramRegistry } from '../../lib/WindowManager';

export const QuickViewMainDataSchema = z.object({
  open: z.string().optional(),
});

export type QuickViewMainData = z.infer<typeof QuickViewMainDataSchema>;

export function registerQuickView(): ProgramRegistry {
  return {
    name: 'QuickView',
    windows: {
      Main: {
        schema: QuickViewMainDataSchema,
        window: QuickViewMainWindow,
        files: [{ match: /\.(bmp|gif|jpe?g|png)$/, param: 'open' }],
      },
    },
  };
}
