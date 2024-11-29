import { z } from 'zod';
import { DiskDefragmenterMainWindow } from './MainWindow';

export function registerDiskDefragmenter() {
  return {
    name: 'DiskDefragmenter',
    windows: {
      Main: {
        schema: z.object({}),
        window: DiskDefragmenterMainWindow,
      },
    },
  };
}
