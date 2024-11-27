import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
  onMount,
} from 'solid-js';
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
import { createWindowURL } from '../../utils/Windows';
import { MenuBar } from '../../components/MenuBar';

export const WordPadMainDataSchema = z.object({
  openFile: z.string().optional(),
});

export type WordPadMainData = z.infer<typeof WordPadMainDataSchema>;

export function WordPadMainWindow(p: {
  window: WindowState;
  data: WordPadMainData;
}) {
  let contentElement!: HTMLDivElement;
  const fileSystem = FileSystemManager.shared;
  const [openFilePath, setOpenFilePath] = createSignal(p.data.openFile);

  const [file] = createResource(openFilePath, fileSystem.getFile);
  const [fileData] = createResource(openFilePath, fileSystem.readFile);

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${file()?.name ?? 'Untitled'} - WordPad`;
      window.icon = 'iconWordPad';
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

  onMount(openFileDialog);

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
                label: 'Print...',
              },
              {
                type: 'item',
                id: 'PrintPreview',
                label: 'Print Preview',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'RecentFile',
                label: 'Recent File',
                disabled: true,
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Send',
                label: 'Send...',
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
                id: 'Clear',
                label: 'Clear',
              },
              {
                type: 'item',
                id: 'SelectAll',
                label: 'Select All',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Links',
                label: 'Links...',
              },
            ],
          },
          {
            type: 'item',
            id: 'View',
            label: 'View',
            submenu: [
              {
                type: 'item',
                id: 'Toolbar',
                label: 'Toolbar',
              },
              {
                type: 'item',
                id: 'FormatBar',
                label: 'Format Bar',
              },
              {
                type: 'item',
                id: 'StatusBar',
                label: 'Status Bar',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Options',
                label: 'Options...',
              },
            ],
          },
          {
            type: 'item',
            id: 'Insert',
            label: 'Insert',
            submenu: [
              {
                type: 'item',
                id: 'DateAndTime',
                label: 'Date and Time...',
              },
              {
                type: 'item',
                id: 'Object',
                label: 'Object...',
              },
            ],
          },
          {
            type: 'item',
            id: 'Format',
            label: 'Format',
            submenu: [
              {
                type: 'item',
                id: 'Font',
                label: 'Font...',
              },
              {
                type: 'item',
                id: 'BulletStyle',
                label: 'Bullet Style',
              },
              {
                type: 'item',
                id: 'Paragraph',
                label: 'Paragraph...',
              },
              {
                type: 'item',
                id: 'Tabs',
                label: 'Tabs...',
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
                id: 'HelpTopics',
                label: 'Help Topics',
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'About',
                label: 'About WordPad',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <div class="Toolbar Horizontal">
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarFileNew" />
        </button>
        <button type="button" class="ToolbarButton" onClick={openFileDialog}>
          <Icon icon="toolbarOpenFolder" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarSave" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarFind" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarCut" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarCopy" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarPaste" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarUndo" />
        </button>
      </div>
      <hr class="HorizontalSeparator" />
      <div class="Toolbar Horizontal">
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarBold" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarItalics" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarUnderline" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarTextColor" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarAlignLeft" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarAlignCenter" />
        </button>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarAlignRight" />
        </button>
        <div class="MediumSpacer"></div>
        <button type="button" class="ToolbarButton">
          <Icon icon="toolbarUnorderedList" />
        </button>
      </div>
      <hr class="HorizontalSeparator" />
      <div class="Field">
        <div class="Content MediumSpacing Document" ref={contentElement}>
          <Markdown markdown={fileData()?.data?.body} />
        </div>
      </div>
    </>
  );
}
