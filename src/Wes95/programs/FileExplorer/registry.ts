import { z } from 'zod';
import { FileExplorerMainWindow } from './MainWindow';

export const FileExplorerMainDataSchema = z.object({
  path: z.string().optional(),
});

export type FileExplorerMainData = z.infer<typeof FileExplorerMainDataSchema>;

export function registerFileExplorer() {
  return {
    name: 'FileExplorer',
    windows: {
      Main: {
        schema: FileExplorerMainDataSchema,
        window: FileExplorerMainWindow,
      },
    },
  };
}
