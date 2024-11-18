import { Markdown } from '@/Wes95/components/Markdown';
import { FileSystemManager } from '@/Wes95/lib/FileSystemManager';
import { WindowManager } from '@/Wes95/lib/WindowManager';
import type { WindowState } from '@/Wes95/models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '@/Wes95/system/FileSystem/OpenWindow';
import { createResource, createSignal, createUniqueId } from 'solid-js';
import { z } from 'zod';

export const WriteEditorDataSchema = z.object({
  url: z.string().optional(),
});

export type WriteEditorData = z.infer<typeof WriteEditorDataSchema>;

export function WriteEditorWindow(p: {
  window: WindowState;
  data: WriteEditorData;
}) {
  const [url, setUrl] = createSignal(p.data.url);

  const [file] = createResource(url, FileSystemManager.shared.readFile);

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
        setUrl(event.url);
      },
      FSOpenEventSchema,
    );
  };

  return (
    <div>
      <Markdown markdown={file()?.data?.body} />

      <button type="button" class="Button" onClick={openFile}>
        Open
      </button>
    </div>
  );
}
