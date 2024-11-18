import { WindowManager } from '@/Wes95/lib/WindowManager';
import type { WindowState } from '@/Wes95/models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '@/Wes95/system/FileSystem/OpenWindow';
import { createSignal, createUniqueId } from 'solid-js';
import { z } from 'zod';

export const NotepadEditorDataSchema = z.object({
  file: z.string().optional(),
});

export type NotepadEditorData = z.infer<typeof NotepadEditorDataSchema>;

export function NotepadEditorWindow(p: {
  window: WindowState;
  data: NotepadEditorData;
}) {
  const [file, setFile] = createSignal(p.data.file);

  const openFile = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      FSOpenDataSchema,
      `system://FileSystem/Open?delegateId=${delegateId}`,
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        setFile(event.url);
      },
      FSOpenEventSchema,
    );
  };

  return (
    <div>
      {file() ?? 'New File'}
      <button type="button" class="Button" onClick={openFile}>
        Open
      </button>
    </div>
  );
}
