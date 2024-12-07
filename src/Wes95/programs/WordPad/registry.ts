import { z } from 'zod';
import type { ProgramRegistry } from '../../lib/WindowManager';
import { WordPadMainWindow } from './MainWindow';

export const WordPadMainDataSchema = z.object({
  open: z.string().optional(),
});

export type WordPadMainData = z.infer<typeof WordPadMainDataSchema>;

export function registerWordPad(): ProgramRegistry {
  return {
    name: 'WordPad',
    windows: {
      Main: {
        schema: WordPadMainDataSchema,
        window: WordPadMainWindow,
        files: [{ match: /\.(doc|md)$/, param: 'open' }],
      },
    },
  };
}
