import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
} from 'solid-js';
import { z } from 'zod';
import { MenuBar } from '../../components/MenuBar';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  FSOpenDataSchema,
  FSOpenEventSchema,
} from '../../system/FileSystem/OpenWindow';
import { createWindowURL } from '../../utils/Windows';

export const NotepadMainDataSchema = z.object({
  file: z.string().optional(),
});

export type NotepadMainData = z.infer<typeof NotepadMainDataSchema>;

export function NotepadMainWindow(p: {
  window: WindowState;
  data: NotepadMainData;
}) {
  let contentElement!: HTMLTextAreaElement;
  const fileSystem = FileSystemManager.shared;
  const [filePath, setFilePath] = createSignal(p.data.file);

  const [file] = createResource(filePath, fileSystem.getFile);
  const [fileData] = createResource(filePath, fileSystem.readFile);

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
          setFilePath(event.filePath);
          contentElement.scrollTo(0, 0);
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  const handleMenuSelect = (id: string) => {
    if (id === 'Exit') {
      WindowManager.shared.closeWindow(p.window.id);
    }
  };

  return (
    <>
      <MenuBar
        items={[
          {
            type: 'item',
            id: 'File',
            label: 'File',
            submenu: [
              {
                type: 'item',
                id: 'New',
                label: 'New...',
              },
              {
                type: 'item',
                id: 'Open',
                label: 'Open...',
              },
              {
                type: 'item',
                id: 'Save',
                label: 'Save',
              },
              {
                type: 'item',
                id: 'SaveAs',
                label: 'Save As...',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Print',
                label: 'Print',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Exit',
                label: 'Exit',
              },
            ],
          },
          {
            type: 'item',
            id: 'Edit',
            label: 'Edit',
            submenu: [
              {
                type: 'item',
                id: 'Undo',
                label: 'Undo',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Cut',
                label: 'Cut',
              },
              {
                type: 'item',
                id: 'Copy',
                label: 'Copy',
              },
              {
                type: 'item',
                id: 'Paste',
                label: 'Paste',
              },
              {
                type: 'item',
                id: 'Delete',
                label: 'Delete',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'SelectAll',
                label: 'Select All',
              },
              {
                type: 'item',
                id: 'TimeDate',
                label: 'Time/Date',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'WordWrap',
                label: 'Word Wrap',
              },
            ],
          },
          {
            type: 'item',
            id: 'Search',
            label: 'Search',
            submenu: [
              {
                type: 'item',
                id: 'Find',
                label: 'Find...',
              },
              {
                type: 'item',
                id: 'FindNext',
                label: 'Find Next',
              },
            ],
          },
          {
            type: 'item',
            id: 'Help',
            label: 'Help',
            submenu: [
              {
                type: 'item',
                id: 'About',
                label: 'About Notepad',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
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
