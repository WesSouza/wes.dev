import { z } from 'zod';
import { WordPadMainWindow } from './MainWindow';

export const WordPadMainDataSchema = z.object({
  open: z.string().optional(),
});

export type WordPadMainData = z.infer<typeof WordPadMainDataSchema>;

export function registerWordPad() {
  return {
    name: 'WordPad',
    windows: {
      Main: {
        schema: WordPadMainDataSchema,
        window: WordPadMainWindow,
      },
    },
  };
}
