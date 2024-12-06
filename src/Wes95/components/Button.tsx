import {
  createEffect,
  createMemo,
  createUniqueId,
  onCleanup,
  useContext,
  type JSX,
} from 'solid-js';
import { FocusContext } from '../lib/FocusContext';
import { WindowManager } from '../lib/WindowManager';
import { WindowContext } from './Window';

export function Button(
  p: {
    appearance?:
      | 'Flat'
      | 'Link'
      | 'Menu'
      | 'Taskbar'
      | 'Thin'
      | 'Toolbar'
      | 'WindowTitle';
    mainWindowButton?: boolean;
    onClick?: () => void;
  } & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const buttonId = createUniqueId();
  const focus = useContext(FocusContext);
  const window = useContext(WindowContext);

  const mainButton = createMemo(() => {
    if (!p.mainWindowButton) {
      return false;
    }

    return (
      WindowManager.shared.state.activeWindow === window?.id &&
      (focus?.activeFocusId() === undefined ||
        focus?.activeFocusId() === buttonId)
    );
  });

  createEffect(() => {
    if (!mainButton()) {
      return;
    }

    document.documentElement.addEventListener('keydown', handleDocumentKeyDown);

    onCleanup(() => {
      document.documentElement.removeEventListener(
        'keydown',
        handleDocumentKeyDown,
      );
    });
  });

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      p.onClick?.();
    }
  };

  const handleBlur = (event: FocusEvent) => {
    focus?.setFocusId(undefined);

    // @ts-expect-error
    p.onBlur?.(event);
  };

  const handleFocus = (event: FocusEvent) => {
    focus?.setFocusId(buttonId);

    // @ts-expect-error
    p.onFocus?.(event);
  };

  return (
    <button
      {...p}
      type="button"
      class={`${p.appearance ?? ''}Button ${mainButton() ? '-main' : ''} ${p.class}`}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {p.children}
    </button>
  );
}
