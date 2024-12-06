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

  const lookInItems = createMemo<MenuItem[]>(() => {
    let path = currentDirectoryPath();
    if (!path.startsWith('/C/')) {
      path = '';
    } else {
      path = path.replace(/^\/C\//, '');
    }

    return [
      {
        id: '/Desktop',
        label: 'Desktop',
        icon: 'toolbarDeskpad',
        type: 'item',
        indentLevel: 0,
      },
      {
        id: '/C/My Documents',
        label: 'My Documents',
        icon: 'iconDocumentsFolder',
        type: 'item',
        indentLevel: 1,
      },
      {
        id: '/My Computer',
        label: 'My Computer',
        icon: 'iconComputer',
        type: 'item',
        indentLevel: 1,
      },
      {
        id: '/A',
        label: '3½ Floppy (A:)',
        icon: 'iconFloppyDrive',
        type: 'item',
        indentLevel: 2,
      },
      {
        id: '/C',
        label: 'Hard Disk (C:)',
        icon: 'iconDrive',
        type: 'item',
        indentLevel: 2,
      },
      ...path
        .split('/')
        .filter(Boolean)
        .reduce<{ name: string; path: string }[]>(
          (directories, directory) => [
            ...directories,
            {
              path: directories
                .map((directory) => directory.name)
                .concat([directory])
                .join('/'),
              name: directory,
            },
          ],
          [],
        )
        .map((directory, index) => ({
          id: `/C/${directory.path}`,
          label: directory.name,
          icon: path === directory.path ? 'iconFolderOpen' : 'iconFolderClosed',
          type: 'item' as const,
          indentLevel: index + 3,
        })),
      {
        id: '/D',
        label: 'CD-ROM (D:)',
        icon: 'iconCDDrive',
        type: 'item',
        indentLevel: 2,
      },
      {
        id: '/Network Neighborhood',
        label: 'Network Neighborhood',
        icon: 'iconNetworkNeighborhood',
        type: 'item',
        indentLevel: 1,
      },
      {
        id: '/My Briefcase',
        label: 'My Briefcase',
        icon: 'iconBriefcase',
        type: 'item',
        indentLevel: 1,
      },
    ];
  });

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
