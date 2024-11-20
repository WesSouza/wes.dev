import { createResource } from 'solid-js';
import { z } from 'zod';
import { ItemList } from '../../components/ItemList';
import { FileSystemManager, type File } from '../../lib/FileSystemManager';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { mapFileType } from '../../utils/icons';

export const FSOpenDataSchema = z.object({
  delegateId: z.string(),
});

export type FSOpenData = z.infer<typeof FSOpenDataSchema>;

export const FSOpenEventSchema = z
  .object({
    filePath: z.string(),
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

  const handleClick = (file: File) => {
    const openArguments = FSOpenEventSchema.parse({
      filePath: file.path,
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
    <div class="Field">
      <div class="Content SmallSpacing">
        <ItemList
          appearance="list"
          items={items()}
          onChange={console.log}
          columns={[
            { key: 'size', name: 'Size' },
            { key: 'type', name: 'Type' },
            { key: 'date', name: 'Date' },
          ]}
        />
      </div>
    </div>
  );
}
