import { createEffect, createSignal, onMount } from 'solid-js';
import { Icon } from '../../components/Icon';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { createWindowURL } from '../../utils/Windows';
import { FSOpenPathEventSchema, type FSOpenPathData } from './registry';
import styles from './style.module.css';
import { Button } from '../../components/Button';

export function FileSystemOpenPathWindow(p: {
  data: FSOpenPathData;
  window: WindowState;
}) {
  const [value, setValue] = createSignal('');

  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      width: 460,
      height: 270,
      showInTaskbar: false,
      sizeConstraints: {
        max: { height: 270 },
        min: { width: 375, height: 270 },
      },
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = p.data.title ?? `Open`;
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
    <div class="Vertical MediumSpacing">
      <div class="Horizontal SmallSpacing MediumGap">
        <Icon icon={p.data.icon ?? 'dialogQuestion'} size="medium" />
        <span class={styles.OpenPathMessage}>
          {p.data.message ??
            'Type the name of program, folder, document, or Internet resource, and the system will open it for you.'}
        </span>
      </div>
      <div class="Horizontal SmallSpacing MediumGap -middle">
        <span class={styles.OpenPathLabel}>Open:</span>
        <input
          classList={{
            TextBox: true,
            [styles.OpenPathInput!]: true,
          }}
          autoCapitalize="off"
          autocorrect="off"
          autofocus
          spellcheck={false}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          value={value()}
        />
      </div>
      <div class="Horizontal SmallSpacing MediumGap -end">
        <div class={styles.OpenPathButtons}>
          <Button mainWindowButton onClick={handleOpen} style="flex: 1">
            OK
          </Button>
          <Button style="flex: 1" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button onClick={handleBrowseClick} disabled={!p.data.browseTypes}>
            Browse...
          </Button>
        </div>
      </div>
    </div>
  );
}
