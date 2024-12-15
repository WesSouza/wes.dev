import { z } from 'zod';
import type { ProgramRegistry } from '../../lib/WindowManager';
import { FindMainWindow } from './MainWindow';

export function registerFind(): ProgramRegistry {
  return {
    name: 'Find',
    windows: {
      Main: {
        schema: z.object({}),
        window: FindMainWindow,
      },
    },
  };
}
