import { createSignal, onMount } from 'solid-js';
import { z } from 'zod';
import { Icon } from '../../components/Icon';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import styles from './style.module.css';
import { createWindowURL } from '../../utils/Windows';

export const FSOpenPathDataSchema = z.object({
  browseTypes: z.array(z.string()).optional(),
  delegateId: z.string(),
  icon: z.string().optional(),
  message: z.string().optional(),
  title: z.string().optional(),
});

export type FSOpenPathData = z.infer<typeof FSOpenPathDataSchema>;

export const FSOpenPathEventSchema = z
  .object({
    filePath: z.string().optional(),
  })
  .brand<'FileSystem/OpenPathEvent'>();

export type FSOpenPathEvent = z.infer<typeof FSOpenPathEventSchema>;

export function FileSystemOpenPathWindow(p: {
  data: FSOpenPathData;
  window: WindowState;
}) {
  const [value, setValue] = createSignal('');

  onMount(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = p.data.title ?? `Open`;
    });
    WindowManager.shared.place(p.window.id, {
      centerToParent: true,
      width: 580,
      height: 380,
    });
  });

  const handleInputChange = (
    event: Event & { currentTarget: HTMLInputElement },
  ) => {
    setValue(event.currentTarget.value);
  };

  const handleInputKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    if (event.code !== 'Enter') {
      return;
    }

    handleOpen();
  };

  const handleOpen = () => {
    WindowManager.shared.delegate(
      p.data.delegateId,
      FSOpenPathEventSchema.parse({
        filePath: value(),
      }),
    );
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handleCancelClick = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handleBrowseClick = () => {
    WindowManager.shared.addWindow(
      createWindowURL('system://FileSystem/Open', {
        delegateId: p.data.delegateId,
        fileTypes: p.data.browseTypes,
      }),
      {
        active: true,
        parentId: p.window.parentId,
      },
    );
    WindowManager.shared.closeWindow(p.window.id);
  };

  return (
    <>
      <div class="Horizontal MediumSpacing">
        <Icon icon={p.data.icon ?? 'dialogQuestion'} size="medium" />
        <span class={styles.OpenPathMessage}>
          {p.data.message ??
            'Type the name of program, folder, document, or Internet resource, and the system will open it for you.'}
        </span>
      </div>
      <div class="Horizontal MediumSpacing">
        <span class={styles.OpenPathLabel}>Open:</span>
        <input
          classList={{
            TextBox: true,
            [styles.OpenPathInput!]: true,
          }}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          value={value()}
        />
      </div>
      <div class="Horizontal SmallSpacing -end">
        <button class="Button" onClick={handleOpen} type="button">
          OK
        </button>
        <button class="Button" onClick={handleCancelClick} type="button">
          Cancel
        </button>
        <button
          class="Button"
          onClick={handleBrowseClick}
          disabled={!p.data.browseTypes}
          type="button"
        >
          Browse...
        </button>
      </div>
    </>
  );
}
