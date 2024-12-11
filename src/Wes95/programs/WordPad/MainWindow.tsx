import {
  createEffect,
  createResource,
  createUniqueId,
  onMount,
  Show,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { Button } from '../../components/Button';
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
  data: WordPadMainData;
  window: WindowState;
}) {
  let contentElement!: HTMLDivElement;
  const fileSystem = FileSystemManager.shared;

  const [store, setStore] = createStore({
    showToolbar: true,
    showFormatBar: true,
  });
  const [file] = createResource(p.data.open, fileSystem.getFile);
  const [fileData] = createResource(p.data.open, fileSystem.readFile);

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
          WindowManager.shared.replaceWindow(
            p.window.id,
            `app://WordPad/Main?open=${encodeURIComponent(event.filePath)}`,
          );
          contentElement.scrollTo(0, 0);
        }
        WindowManager.shared.setActiveWindow(p.window);
      },
      FSOpenEventSchema,
    );
  };

  const handleNew = () => {
    WindowManager.shared.replaceWindow(p.window.id, `app://WordPad/Main`);
  };

  const handleMenuSelect = (id: string) => {
    switch (id) {
      case 'BulletStyle': {
        execCommand('insertUnorderedList');
        break;
      }
      case 'Copy': {
        execCommand('copy');
        break;
      }
      case 'Cut': {
        execCommand('cut');
        break;
      }
      case 'Exit': {
        WindowManager.shared.closeWindow(p.window.id);
        break;
      }
      case 'FormatBar': {
        setStore('showFormatBar', (formatBar) => !formatBar);
        break;
      }
      case 'New': {
        handleNew();
        break;
      }
      case 'Open': {
        openFileDialog();
        break;
      }
      case 'Paste': {
        execCommand('paste');
        break;
      }
      case 'Toolbar': {
        setStore('showToolbar', (toolbar) => !toolbar);
        break;
      }
      case 'Undo': {
        execCommand('undo');
        break;
      }
    }
  };

  const execCommand = (command: string, argument?: string) => {
    contentElement.contentEditable = 'true';
    document.execCommand(command, false, argument);
    contentElement.contentEditable = 'false';
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
                disabled: true,
              },
              {
                type: 'item',
                id: 'SaveAs',
                label: 'Save As...',
                disabled: true,
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Print',
                label: 'Print...',
                disabled: true,
              },
              {
                type: 'item',
                id: 'PrintPreview',
                label: 'Print Preview',
                disabled: true,
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
                checked: store.showToolbar ? 'checkmark' : undefined,
              },
              {
                type: 'item',
                id: 'FormatBar',
                label: 'Format Bar',
                checked: store.showFormatBar ? 'checkmark' : undefined,
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'Options',
                label: 'Options...',
                disabled: true,
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
                disabled: true,
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
                disabled: true,
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
      <Show when={store.showToolbar}>
        <hr class="HorizontalSeparator" />
        <div class="Toolbar Horizontal">
          <Button appearance="Toolbar" aria-label="New" onClick={handleNew}>
            <Icon icon="toolbarFileNew" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Open"
            onClick={openFileDialog}
          >
            <Icon icon="toolbarOpenFolder" />
          </Button>
          <Button appearance="Toolbar" aria-label="Save" disabled>
            <Icon icon="toolbarSave" />
          </Button>
          <div class="MediumSpacer"></div>
          <Button appearance="Toolbar" aria-label="Find" disabled>
            <Icon icon="toolbarFind" />
          </Button>
          <div class="MediumSpacer"></div>
          <Button
            appearance="Toolbar"
            aria-label="Cut"
            onClick={() => execCommand('cut')}
          >
            <Icon icon="toolbarCut" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Copy"
            onClick={() => execCommand('copy')}
          >
            <Icon icon="toolbarCopy" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Paste"
            onClick={() => execCommand('paste')}
          >
            <Icon icon="toolbarPaste" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Undo"
            onClick={() => execCommand('undo')}
          >
            <Icon icon="toolbarUndo" />
          </Button>
        </div>
      </Show>
      <Show when={store.showFormatBar}>
        <hr class="HorizontalSeparator" />
        <div class="Toolbar Horizontal">
          <Button
            appearance="Toolbar"
            aria-label="Bold"
            onClick={() => execCommand('bold')}
          >
            <Icon icon="toolbarBold" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Italics"
            onClick={() => execCommand('italic')}
          >
            <Icon icon="toolbarItalics" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Underline"
            onClick={() => execCommand('underline')}
          >
            <Icon icon="toolbarUnderline" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Text Color"
            onClick={() => execCommand('foreColor', '#ff0000')}
          >
            <Icon icon="toolbarTextColor" />
          </Button>
          <div class="MediumSpacer"></div>
          <Button
            appearance="Toolbar"
            aria-label="Align Left"
            onClick={() => execCommand('justifyLeft')}
          >
            <Icon icon="toolbarAlignLeft" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Align Center"
            onClick={() => execCommand('justifyCenter')}
          >
            <Icon icon="toolbarAlignCenter" />
          </Button>
          <Button
            appearance="Toolbar"
            aria-label="Align Right"
            onClick={() => execCommand('justifyRight')}
          >
            <Icon icon="toolbarAlignRight" />
          </Button>
          <div class="MediumSpacer"></div>
          <Button
            appearance="Toolbar"
            aria-label="Unordered List"
            onClick={() => execCommand('insertUnorderedList')}
          >
            <Icon icon="toolbarUnorderedList" />
          </Button>
        </div>
      </Show>
      <div class="Field">
        <div class="Content MediumSpacing Document" ref={contentElement}>
          <Markdown markdown={fileData()?.body} />
        </div>
      </div>
    </>
  );
}
