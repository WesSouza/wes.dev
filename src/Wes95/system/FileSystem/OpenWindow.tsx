import { z } from 'zod';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';

export const FSOpenDataSchema = z.object({
  delegateId: z.string(),
});

export type FSOpenData = z.infer<typeof FSOpenDataSchema>;

export const FSOpenEventSchema = z
  .object({
    url: z.string(),
  })
  .brand<'FileSystem/OpenEvent'>();

export type FSOpenEvent = z.infer<typeof FSOpenEventSchema>;

export function FileSystemOpenWindow(p: {
  data: FSOpenData;
  window: WindowState;
}) {
  const handleClick = () => {
    const openArguments = FSOpenEventSchema.parse({
      url: 'file:///Test.txt',
    });
    WindowManager.shared.delegate(p.data.delegateId, openArguments);
    WindowManager.shared.closeWindow(p.window.id);
  };

  return (
    <div>
      <button onClick={handleClick} class="Button">
        Open
      </button>
    </div>
  );
}
