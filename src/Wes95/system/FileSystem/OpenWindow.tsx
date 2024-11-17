import { WindowManager } from 'src/Wes95/lib/WindowManager';
import type { WindowState } from 'src/Wes95/models/WindowState';
import { z } from 'zod';

export const OpenDataSchema = z.object({
  delegateId: z.string(),
});

export type OpenData = z.infer<typeof OpenDataSchema>;

export const OpenEventSchema = z
  .object({
    url: z.string(),
  })
  .brand<'FileSystem/OpenEvent'>();

export type OpenEvent = z.infer<typeof OpenEventSchema>;

export function FileSystemOpenWindow(p: {
  data: OpenData;
  window: WindowState;
}) {
  const handleClick = () => {
    const openArguments = OpenEventSchema.parse({
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
