import {
  createEffect,
  createResource,
  createSignal,
  createUniqueId,
  onMount,
} from 'solid-js';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import { MenuBar } from '../../components/MenuBar';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { FSOpenEventSchema } from '../../system/FileSystem/registry';
import { createWindowURL } from '../../utils/Windows';
import type { WordPadMainData } from './registry';

export function WordPadMainWindow(p: {
  window: WindowState;
  data: WordPadMainData;
}) {
  let contentElement!: HTMLDivElement;
  const fileSystem = FileSystemManager.shared;
  const [filePath, setFilePath] = createSignal(p.data.file);

  const [file] = createResource(filePath, fileSystem.getFile);
  const [fileData] = createResource(filePath, fileSystem.readFile);

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      width: 450,
      height: 500,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${file()?.name ?? 'Untitled'} - WordPad`;
      window.icon = 'iconWordPad';
    });
  });

  const openFileDialog = () => {
    const delegateId = createUniqueId();
    WindowManager.shared.addWindow(
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
                id: 'Image',
                label: 'Image...',
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
                label: 'About WordPad',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <hr class="HorizontalSeparator" />
      <div class="Toolbar Horizontal">
        <button aria-label="New" class="ToolbarButton" type="button">
          <Icon icon="toolbarFileNew" />
        </button>
        <button
          aria-label="Open"
          class="ToolbarButton"
          onClick={openFileDialog}
          type="button"
        >
          <Icon icon="toolbarOpenFolder" />
        </button>
        <button aria-label="Save" class="ToolbarButton" type="button">
          <Icon icon="toolbarSave" />
        </button>
        <div class="MediumSpacer"></div>
        <button aria-label="Find" class="ToolbarButton" type="button">
          <Icon icon="toolbarFind" />
        </button>
        <div class="MediumSpacer"></div>
        <button aria-label="Cut" class="ToolbarButton" type="button">
          <Icon icon="toolbarCut" />
        </button>
        <button aria-label="Copy" class="ToolbarButton" type="button">
          <Icon icon="toolbarCopy" />
        </button>
        <button aria-label="Paste" class="ToolbarButton" type="button">
          <Icon icon="toolbarPaste" />
        </button>
        <button aria-label="Undo" class="ToolbarButton" type="button">
          <Icon icon="toolbarUndo" />
        </button>
      </div>
      <hr class="HorizontalSeparator" />
      <div class="Toolbar Horizontal">
        <button aria-label="Bold" class="ToolbarButton" type="button">
          <Icon icon="toolbarBold" />
        </button>
        <button aria-label="Italics" class="ToolbarButton" type="button">
          <Icon icon="toolbarItalics" />
        </button>
        <button aria-label="Underline" class="ToolbarButton" type="button">
          <Icon icon="toolbarUnderline" />
        </button>
        <button aria-label="Text Color" class="ToolbarButton" type="button">
          <Icon icon="toolbarTextColor" />
        </button>
        <div class="MediumSpacer"></div>
        <button aria-label="Align Left" class="ToolbarButton" type="button">
          <Icon icon="toolbarAlignLeft" />
        </button>
        <button aria-label="Align Center" class="ToolbarButton" type="button">
          <Icon icon="toolbarAlignCenter" />
        </button>
        <button aria-label="Align Right" class="ToolbarButton" type="button">
          <Icon icon="toolbarAlignRight" />
        </button>
        <div class="MediumSpacer"></div>
        <button aria-label="Unordered List" class="ToolbarButton" type="button">
          <Icon icon="toolbarUnorderedList" />
        </button>
      </div>
      <div class="Field">
        <div class="Content MediumSpacing Document" ref={contentElement}>
          <Markdown markdown={fileData()?.data?.body} />
        </div>
      </div>
    </>
  );
}
