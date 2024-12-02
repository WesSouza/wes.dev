import { z } from 'zod';
import { NotepadMainWindow } from './MainWindow';

export const NotepadMainDataSchema = z.object({
  open: z.string().optional(),
});

export type NotepadMainData = z.infer<typeof NotepadMainDataSchema>;

export function registerNotepad() {
  return {
    name: 'Notepad',
    windows: {
      Main: {
        schema: NotepadMainDataSchema,
        window: NotepadMainWindow,
      },
    },
  };
}
