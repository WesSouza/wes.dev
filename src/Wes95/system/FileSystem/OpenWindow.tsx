import { createMemo, createResource, createSignal } from 'solid-js';
import { z } from 'zod';
import { ItemList } from '../../components/ItemList';
import {
  FileSystemManager,
  type Directory,
  type File,
} from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { mapFileType } from '../../utils/icons';
import { Icon } from '../../components/Icon';
import { Combobox } from '../../components/Combobox';
import type { MenuItem } from '../../components/Menu';

export const FSOpenDataSchema = z.object({
  delegateId: z.string(),
});

export type FSOpenData = z.infer<typeof FSOpenDataSchema>;

export const FSOpenEventSchema = z
  .object({
    filePath: z.string().optional(),
  })
  .brand<'FileSystem/OpenEvent'>();

export type FSOpenEvent = z.infer<typeof FSOpenEventSchema>;

export function FileSystemOpenWindow(p: {
  data: FSOpenData;
  window: WindowState;
}) {
  const [currentDirectoryPath, setCurrentDirectoryPath] = createSignal(
    '/C/My Documents/Blog',
  );
  const [files] = createResource(
    currentDirectoryPath,
    FileSystemManager.shared.getFiles,
  );

  const [file, setFile] = createSignal<File | Directory | undefined>();

  const chooseFile = (filePath: string | undefined) => {
    const file = files()?.find((file) => file.path === filePath);
    setFile(file);
  };

  const handleFolderUpClick = () => {
    const path = currentDirectoryPath();
    let newPath = path;
    if (/^\/[A-Z]\//.test(path)) {
      newPath = path.replace(/\/[^/]+$/, '');
    }
    if (/^\/[A-Z]$/.test(path)) {
      newPath = '/My Website';
    }
    if (path === '/My Website') {
      newPath = '/Desktop';
    }
    setCurrentDirectoryPath(newPath);
  };

  const handleDesktopClick = () => {
    setCurrentDirectoryPath('/Desktop');
  };

  const handleOpenClick = () => {
    const currentFile = file();
    if (!currentFile) {
      return;
    }

    if (currentFile.type === 'directory') {
      setCurrentDirectoryPath(currentFile.path);
      return;
    }

    const openArguments = FSOpenEventSchema.parse({
      filePath: currentFile.path,
    });
    WindowManager.shared.delegate(p.data.delegateId, openArguments);
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handleCancelClick = () => {
    const openArguments = FSOpenEventSchema.parse({
      filePath: undefined,
    });
    WindowManager.shared.delegate(p.data.delegateId, openArguments);
    WindowManager.shared.closeWindow(p.window.id);
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
        id: '/My Website',
        label: 'My Website',
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
      <div class="Toolbar Horizontal SmallSpacing">
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
          <button class="ToolbarButton" type="button">
            <Icon icon="toolbarIconsList" />
          </button>
          <button class="ToolbarButton" type="button">
            <Icon icon="toolbarIconsDetails" />
          </button>
        </div>
      </div>
      <div class="Field">
        <div class="Content SmallSpacing">
          <ItemList
            appearance="list"
            items={items()}
            onChange={chooseFile}
            onItemDblClick={handleOpenClick}
            columns={[
              { key: 'size', name: 'Size' },
              { key: 'type', name: 'Type' },
              { key: 'date', name: 'Date' },
            ]}
          />
        </div>
      </div>
      <div class="Horizontal -center SmallSpacing">
        <label for={`${p.window.id}-fileName`}>File name:</label>
        <input id={`${p.window.id}-fileName`} class="TextBox" />
        <button type="button" class="Button" onClick={handleOpenClick}>
          Open
        </button>
        <button type="button" class="Button" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </>
  );
}
