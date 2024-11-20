import { createResource, For, Show } from 'solid-js';
import { z } from 'zod';
import { FileSystemManager, type File } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';

export const FSOpenDataSchema = z.object({
  delegateId: z.string(),
});

export type FSOpenData = z.infer<typeof FSOpenDataSchema>;

export const FSOpenEventSchema = z
  .object({
    filePath: z.string(),
  })
  .brand<'FileSystem/OpenEvent'>();

export type FSOpenEvent = z.infer<typeof FSOpenEventSchema>;

export function FileSystemOpenWindow(p: {
  data: FSOpenData;
  window: WindowState;
}) {
  const [files] = createResource(
    '/C/My_Documents/Blog',
    FileSystemManager.shared.getFiles,
  );

  const handleClick = (file: File) => {
    const openArguments = FSOpenEventSchema.parse({
      filePath: file.path,
    });
    WindowManager.shared.delegate(p.data.delegateId, openArguments);
    WindowManager.shared.closeWindow(p.window.id);
  };

  return (
    <div class="Field">
      <div class="Content MediumSpacing">
        <For each={files()}>
          {(file) => (
            <Show when={file.type === 'file'}>
              <button
                onClick={() =>
                  handleClick(
                    // @ts-expect-error
                    file,
                  )
                }
                class="Button"
              >
                {file.name}
              </button>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
