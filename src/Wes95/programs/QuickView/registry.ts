import { z } from 'zod';
import { QuickViewMainWindow } from './MainWindow';

export const QuickViewMainDataSchema = z.object({
  open: z.string().optional(),
});

export type QuickViewMainData = z.infer<typeof QuickViewMainDataSchema>;

export function registerQuickView() {
  return {
    name: 'QuickView',
    windows: {
      Main: {
        schema: QuickViewMainDataSchema,
        window: QuickViewMainWindow,
      },
    },
  };
}
