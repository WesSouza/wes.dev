import { createResource, createSignal } from 'solid-js';
import { z } from 'zod';
import { ItemList } from '../../components/ItemList';
import { FileSystemManager, type File } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { mapFileType } from '../../utils/icons';
import { Icon } from '../../components/Icon';

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
  const [files] = createResource(
    '/C/My_Documents/Blog',
    FileSystemManager.shared.getFiles,
  );

  const [file, setFile] = createSignal<File | undefined>();

  const chooseFile = (filePath: string | undefined) => {
    const file = files()?.find((file) => file.path === filePath);
    setFile(file && file.type === 'file' ? file : undefined);
  };

  const handleOpenClick = () => {
    if (!file()) {
      return;
    }

    const openArguments = FSOpenEventSchema.parse({
      filePath: file()?.path,
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
        <span class="Field">Tree Combobox</span>
        <button class="ToolbarButton">
          <Icon icon="toolbarFolderUp" />
        </button>
        <button class="ToolbarButton">
          <Icon icon="toolbarDeskpad" />
        </button>
        <button class="ToolbarButton">
          <Icon icon="toolbarFolderNew" />
        </button>
        <div class="ButtonGroup Horizontal">
          <button class="ToolbarButton">
            <Icon icon="toolbarIconsList" />
          </button>
          <button class="ToolbarButton">
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
      <div class="Vertical">
        <div class="Horizontal">
          <label for={`${p.window.id}-fileName`}>File name:</label>
          <input id={`${p.window.id}-fileName`} class="TextBox" />
          <button type="button" class="Button" onClick={handleOpenClick}>
            Open
          </button>
        </div>
        <div class="Horizontal">
          <label for={`${p.window.id}-filesOfType`}>Files of type:</label>
          <input id={`${p.window.id}-filesOfType`} class="TextBox" />
          <button type="button" class="Button" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
