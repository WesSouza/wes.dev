import { createSignal, onMount } from 'solid-js';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import {
  BlueskySearchDialogEventSchema,
  type BlueskySearchDialogData,
} from './registry';
import styles from './style.module.css';

export function BlueskySearchDialogWindow(p: {
  data: BlueskySearchDialogData;
  window: WindowState;
}) {
  const [value, setValue] = createSignal('');

  onMount(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = `Find`;
    });
    WindowManager.shared.place(p.window.id, {
      width: 460,
      height: 170,
      sizeConstraints: {
        max: { height: 170 },
        min: { width: 470, height: 170 },
      },
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
      BlueskySearchDialogEventSchema.parse({
        q: value(),
      }),
    );
    WindowManager.shared.closeWindow(p.window.id);
  };

  const handleCancelClick = () => {
    WindowManager.shared.closeWindow(p.window.id);
  };

  return (
    <div class="Vertical MediumSpacing">
      <div class="Horizontal SmallSpacing MediumGap FlexGrow -top">
        <div class="Horizontal SmallSpacing MediumGap FlexGrow -middle">
          <span class={styles.SearchDialogLabel}>Find what:</span>
          <input
            classList={{
              TextBox: true,
              [styles.SearchDialogInput!]: true,
            }}
            autoCapitalize="off"
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            value={value()}
          />
        </div>
        <div class="Vertical SmallSpacing MediumGap">
          <div class={styles.SearchDialogButtons}>
            <button
              class="Button"
              style="flex: 1"
              onClick={handleOpen}
              type="button"
            >
              OK
            </button>
            <button
              class="Button"
              style="flex: 1"
              onClick={handleCancelClick}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
