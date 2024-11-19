import { createResource, createSignal, createUniqueId } from 'solid-js';
import { z } from 'zod';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '../../system/FileSystem/OpenWindow';

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
    <>
      <div class="Toolbar Horizontal">
        <button type="button" class="Button" onClick={openFile}>
          <Icon icon="toolbarOpen" />
        </button>
      </div>
      <hr class="HorizontalSeparator" />
      <div class="Field" style={{ 'flex-grow': 1 }}>
        <Markdown markdown={file()?.data?.body} />
      </div>
    </>
  );
}
