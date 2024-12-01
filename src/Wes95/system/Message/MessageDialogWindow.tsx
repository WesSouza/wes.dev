import { createEffect, For, onMount, Show } from 'solid-js';
import { Icon } from '../../components/Icon';
import { WindowManager } from '../../lib/WindowManager';
import type { WindowState } from '../../models/WindowState';
import { MessageDialogEventSchema, type MessageDialogData } from './registry';

const IconTypeMap: Record<string, string> = {
  error: 'dialogError',
  question: 'dialogQuestion',
  warning: 'dialogWarning',
};

const ButtonsTypeMap: Record<string, string[]> = {
  question: ['Yes', 'No', 'Cancel'],
  default: ['Ok'],
};

export function MessageDialogWindow(p: {
  data: MessageDialogData;
  window: WindowState;
}) {
  onMount(() => {
    WindowManager.shared.init(p.window.id, {
      centerToParent: true,
      maximizable: false,
      minimizable: false,
      showInTaskbar: false,
      sizeAutomatic: true,
    });
  });

  createEffect(() => {
    WindowManager.shared.setWindow(p.window.id, (window) => {
      window.title = p.data.title;
    });
  });

  const handleClick = (button: string) => {
    WindowManager.shared.delegate(
      p.data.delegateId,
      MessageDialogEventSchema.parse({
        button,
      }),
    );
  };

  return (
    <>
      <div class="Horizontal MediumSpacing">
        <Show when={IconTypeMap[p.data.type]}>
          <Icon icon={IconTypeMap[p.data.type]!} size="medium" />
        </Show>
        <div>{p.data.message}</div>
      </div>
      <div class="Horizontal MediumSpacing -center">
        <For each={ButtonsTypeMap[p.data.type] ?? ButtonsTypeMap.default}>
          {(button) => (
            <button class="Button" onClick={() => handleClick(button)}>
              {button}
            </button>
          )}
        </For>
      </div>
    </>
  );
}
