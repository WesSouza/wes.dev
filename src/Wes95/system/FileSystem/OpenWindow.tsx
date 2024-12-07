import {
  createMemo,
  createResource,
  createSignal,
  onMount,
  Show,
} from 'solid-js';
import { Combobox } from '../../components/Combobox';
import { Icon } from '../../components/Icon';
import { ItemList } from '../../components/ItemList';
import type { MenuItem } from '../../components/Menu';
import { FileSystemManager } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { filterFileTypes, mapFileType } from '../../utils/fileTypes';
import { FSOpenEventSchema, type FSOpenData } from './registry';

export function FileSystemOpenWindow(p: {
  data: FSOpenData;
  window: WindowState;
}) {
  const [listType, setListType] = createSignal<'list' | 'details'>('list');
  const [currentDirectoryPath, setCurrentDirectoryPath] = createSignal(
    p.data.path ?? '/Desktop',
  );
  const [files] = createResource(
    currentDirectoryPath,
    FileSystemManager.shared.getFiles,
  );

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      centerToParent: true,
      title: 'Open',
      width: 580,
      height: 380,
    });
  });

  const showExtraToolbarButtons = createMemo(() => {
    return p.window.width > 550;
  });

  const chooseFile = (filePath: string | undefined) => {
    const file = files()?.find((file) => file.path === filePath);
    if (!file) {
      return;
    }

    if (file.type === 'directory') {
      setCurrentDirectoryPath(file.path);
      return;
    }

    const openArguments = FSOpenEventSchema.parse({
      filePath: file.path,
    });
    WindowManager.shared.delegate(p.data.delegateId, openArguments);
    WindowManager.shared.closeWindow(p.window.id);
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

  const handleDesktopClick = () => {
    setCurrentDirectoryPath('/Desktop');
  };

  const lookInItems = createMemo<MenuItem[]>(() =>
    FileSystemManager.getLookInMenu(currentDirectoryPath()),
  );

  const items = () =>
    files()
      ?.filter(filterFileTypes(p.data.fileTypes))
      .map((file) => {
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
      <div class="Toolbar Horizontal -middle SmallSpacing">
        <span>Look in:</span>
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
        <Show when={showExtraToolbarButtons()}>
          <button
            class="ToolbarButton"
            type="button"
            onClick={handleDesktopClick}
          >
            <Icon icon="toolbarDeskpad" />
          </button>
          <button class="ToolbarButton" type="button">
            <Icon icon="toolbarFolderNew" />
          </button>
          <div class="ButtonGroup Horizontal">
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
        </Show>
      </div>
      <div class="Field">
        <div class="Content SmallSpacing">
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
