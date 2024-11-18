import { createSignal, createUniqueId } from 'solid-js';
import { z } from 'zod';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '../../system/FileSystem/OpenWindow';

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
