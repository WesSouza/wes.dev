import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onMount,
  Show,
} from 'solid-js';
import { Combobox } from '../../components/Combobox';
import { Icon } from '../../components/Icon';
import { ItemList } from '../../components/ItemList';
import { MenuBar } from '../../components/MenuBar';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { mapFileType } from '../../utils/fileTypes';
import type { FileExplorerMainData } from './registry';
import styles from './style.module.css';

export function FileExplorerMainWindow(p: {
  data: FileExplorerMainData;
  window: WindowState;
}) {
  const [showToolbar, setShowToolbar] = createSignal(true);
  const [listType, setListType] = createSignal<'icons' | 'list' | 'details'>(
    'icons',
  );
  const [currentDirectoryPath, setCurrentDirectoryPath] = createSignal(
    p.data.path ?? '/Desktop',
  );
  const [files] = createResource(
    currentDirectoryPath,
    FileSystemManager.shared.getFiles,
  );

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      width: 450,
      height: 500,
    });
  });

  createEffect(() => {
    const directoryName = currentDirectoryPath().substring(
      currentDirectoryPath().lastIndexOf('/') + 1,
    );

    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `${directoryName} - File Explorer`;
      window.icon = 'iconFolderOpen';
    });
  });

  const handleMenuSelect = (id: string) => {
    switch (id) {
      case 'Details': {
        setListType('details');
        break;
      }
      case 'Icons': {
        setListType('icons');
        break;
      }
      case 'Exit': {
        WindowManager.shared.closeWindow(p.window.id);
        break;
      }
      case 'List': {
        setListType('list');
        break;
      }
      case 'Toolbar': {
        setShowToolbar((show) => !show);
        break;
      }
    }
  };

  const chooseFile = (filePath: string | undefined) => {
    const file = files()?.find((file) => file.path === filePath);
    if (!file) {
      return;
    }

    if (file.type === 'directory') {
      setCurrentDirectoryPath(file.path);
      return;
    }

    if (file.type === 'shortcut') {
      WindowManager.shared.addWindow(file.url, { active: true });
      return;
    }

    const programUrl = WindowManager.shared.matchPath(file.path);
    if (programUrl) {
      WindowManager.shared.addWindow(programUrl, { active: true });
      return;
    }

    WindowManager.shared.messageDialog({
      type: 'error',
      title: 'Error',
      message: `Unable to find a program that can open the file "${file.name}".`,
      parentId: p.window.id,
    });
  };

  const handleFolderUpClick = () => {
    const path = currentDirectoryPath();
    let newPath = path;
    if (/^\/[A-Z]\//.test(path)) {
      newPath = path.replace(/\/[^/]+$/, '');
    }
    if (/^\/[A-Z]$/.test(path)) {
      newPath = '/My Computer';
    }
    if (path === '/My Computer') {
      newPath = '/Desktop';
    }
    setCurrentDirectoryPath(newPath);
  };

  const lookInItems = createMemo(() =>
    FileSystemManager.getLookInMenu(currentDirectoryPath()),
  );

  const items = () =>
    files()?.map((file) => {
      const type = mapFileType(file);
      return {
        id: file.path,
        name: file.name,
        icon: type.icon,
        columns: {
          size: {
            value: '',
            sortValue: '',
          },
          type: {
            value: type.name,
            sortValue: type.name,
          },
          date: {
            value: '',
            sortValue: '',
          },
        },
      };
    }) ?? [];

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
                id: 'Exit',
                label: 'Exit',
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
                checked: showToolbar() ? 'checkmark' : undefined,
              },
              {
                type: 'separator',
              },
              {
                type: 'item',
                id: 'LargeIcons',
                label: 'Large Icons',
                checked: listType() === 'icons' ? 'radio' : undefined,
              },
              {
                type: 'item',
                id: 'List',
                label: 'List',
                checked: listType() === 'list' ? 'radio' : undefined,
              },
              {
                type: 'item',
                id: 'Details',
                label: 'Details',
                checked: listType() === 'details' ? 'radio' : undefined,
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
                label: 'About File Explorer',
              },
            ],
          },
        ]}
        onSelect={handleMenuSelect}
      />
      <Show when={showToolbar()}>
        <hr class="HorizontalSeparator" />
        <div class="Toolbar Horizontal -middle SmallSpacing">
          <Combobox
            appearance="icon"
            items={lookInItems()}
            selectedItem={currentDirectoryPath()}
            onChange={setCurrentDirectoryPath}
          />
          <button
            class="ToolbarButton"
            disabled={currentDirectoryPath() === '/Desktop'}
            onClick={handleFolderUpClick}
            type="button"
          >
            <Icon icon="toolbarFolderUp" />
          </button>
          <button class="ToolbarButton" type="button">
            <Icon icon="toolbarFolderNew" />
          </button>
          <div class="ButtonGroup Horizontal">
            <button
              classList={{
                ToolbarButton: true,
                '-active': listType() === 'icons',
                '-down': listType() === 'icons',
              }}
              onClick={() => setListType('icons')}
              type="button"
            >
              <Icon icon="toolbarIcons" />
            </button>
            <button
              classList={{
                ToolbarButton: true,
                '-active': listType() === 'list',
                '-down': listType() === 'list',
              }}
              onClick={() => setListType('list')}
              type="button"
            >
              <Icon icon="toolbarIconsList" />
            </button>
            <button
              classList={{
                ToolbarButton: true,
                '-active': listType() === 'details',
                '-down': listType() === 'details',
              }}
              onClick={() => setListType('details')}
              type="button"
            >
              <Icon icon="toolbarIconsDetails" />
            </button>
          </div>
        </div>
      </Show>
      <div
        classList={{
          Field: true,
          [styles.FieldTable!]: listType() === 'details',
        }}
      >
        <div
          classList={{
            Content: true,
            SmallSpacing: listType() !== 'details',
          }}
        >
          <ItemList
            appearance={listType()}
            items={items()}
            onSelect={chooseFile}
            columns={[
              { key: 'size', name: 'Size' },
              { key: 'type', name: 'Type' },
              { key: 'date', name: 'Date' },
            ]}
          />
        </div>
      </div>
    </>
  );
}
