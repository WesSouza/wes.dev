import {
  createEffect,
  createMemo,
  createUniqueId,
  onCleanup,
  splitProps,
  useContext,
  type JSX,
} from 'solid-js';
import { Button as Css95Button } from 'css95/solid';
import { FocusContext } from '../lib/FocusContext';
import { WindowManager } from '../lib/WindowManager';
import { WindowContext } from './Window';

export function Button(
  p: {
    appearance?:
      'Flat' | 'Link' | 'Menu' | 'Taskbar' | 'Thin' | 'Toolbar' | 'WindowTitle';
    mainWindowButton?: boolean;
    onClick?: () => void;
  } & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const buttonId = createUniqueId();
  const focus = useContext(FocusContext);
  const window = useContext(WindowContext);
  const [local, buttonProps] = splitProps(p, [
    'appearance',
    'children',
    'class',
    'mainWindowButton',
    'onBlur',
    'onClick',
    'onFocus',
  ]);

  const mainButton = createMemo(() => {
    if (!local.mainWindowButton) {
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
      local.onClick?.();
    }
  };

  const handleBlur = (event: FocusEvent) => {
    focus?.setFocusId(undefined);

    // @ts-expect-error
    local.onBlur?.(event);
  };

  const handleFocus = (event: FocusEvent) => {
    focus?.setFocusId(buttonId);

    // @ts-expect-error
    local.onFocus?.(event);
  };

  const packageAppearance = createMemo(() =>
    ['Flat', 'Menu', 'WindowTitle', undefined].includes(local.appearance),
  );

  const fallbackClass = () =>
    `${local.appearance ?? ''}Button ${mainButton() ? '-main' : ''} ${local.class ?? ''}`;

  if (packageAppearance()) {
    return (
      <Css95Button
        {...buttonProps}
        flat={local.appearance === 'Flat'}
        menu={local.appearance === 'Menu'}
        title={local.appearance === 'WindowTitle'}
        main={mainButton()}
        class={local.class}
        onBlur={handleBlur}
        onClick={local.onClick}
        onFocus={handleFocus}
      >
        {local.children}
      </Css95Button>
    );
  }

  return (
    <button
      {...buttonProps}
      type="button"
      class={fallbackClass()}
      onBlur={handleBlur}
      onClick={local.onClick}
      onFocus={handleFocus}
    >
      {local.children}
    </button>
  );
}
