import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
} from 'solid-js';
import { z } from 'zod';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '../../system/FileSystem/OpenWindow';
import { createWindowURL } from '../../utils/Windows';

export const NotepadMainDataSchema = z.object({
  openFile: z.string().optional(),
});

export type NotepadMainData = z.infer<typeof NotepadMainDataSchema>;

export function NotepadMainWindow(p: {
  window: WindowState;
  data: NotepadMainData;
}) {
  let contentElement!: HTMLTextAreaElement;
  const fileSystem = FileSystemManager.shared;
  const [openFilePath, setOpenFilePath] = createSignal(p.data.openFile);

  const [file] = createResource(openFilePath, fileSystem.getFile);
  const [fileData] = createResource(openFilePath, fileSystem.readFile);

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${file()?.name ?? 'Untitled'} - Notepad`;
      window.icon = 'iconNotepad';
    });
  });

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
      FSOpenDataSchema,
      createWindowURL('system://FileSystem/Open', {
        delegateId,
        fileTypes: ['document'],
      }),
      {
        active: true,
        parentId: p.window.id,
      },
    );

    WindowManager.shared.handleOnce(
      delegateId,
      (event) => {
        if (event.filePath) {
          setOpenFilePath(event.filePath);
          contentElement.scrollTo(0, 0);
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  return (
    <>
      <div>
        <button class="Button" type="button" onClick={openFileDialog}>
          Open
        </button>
      </div>
      <textarea class="Field" ref={contentElement}>
        {fileData()?.data?.body}
      </textarea>
    </>
  );
}
