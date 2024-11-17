import { WindowManager } from '@/Wes95/lib/WindowManager';
import type { WindowState } from '@/Wes95/models/WindowState';
import {
  OpenDataSchema,
  OpenEventSchema,
} from '@/Wes95/system/FileSystem/OpenWindow';
import { createSignal, createUniqueId } from 'solid-js';
import { z } from 'zod';

export const EditorDataSchema = z.object({
  file: z.string().optional(),
});

export type EditorData = z.infer<typeof EditorDataSchema>;

export function NotepadEditorWindow(p: {
  window: WindowState;
  data: EditorData;
}) {
  const [file, setFile] = createSignal(p.data.file);

  const openFile = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      OpenDataSchema,
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
      OpenEventSchema,
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
