import {
  Button as Css95Button,
  FlatButton as Css95FlatButton,
  LinkButton as Css95LinkButton,
  MenuButton as Css95MenuButton,
  TaskbarButton as Css95TaskbarButton,
  ThinButton as Css95ThinButton,
  ToolbarButton as Css95ToolbarButton,
  WindowTitleButton as Css95WindowTitleButton,
} from 'css95/solid';
import {
  createEffect,
  createMemo,
  createUniqueId,
  onCleanup,
  splitProps,
  useContext,
  type JSX,
} from 'solid-js';
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

  const packageButton = createMemo(() => {
    switch (local.appearance) {
      case 'Flat':
        return Css95FlatButton;
      case 'Link':
        return Css95LinkButton;
      case 'Menu':
        return Css95MenuButton;
      case 'Taskbar':
        return Css95TaskbarButton;
      case 'Thin':
        return Css95ThinButton;
      case 'Toolbar':
        return Css95ToolbarButton;
      case 'WindowTitle':
        return Css95WindowTitleButton;
      default:
        return Css95Button;
    }
  });

  const PackageButton = packageButton();

  return (
    <PackageButton
      {...buttonProps}
      appearance={mainButton() ? 'main' : undefined}
      class={local.class}
      onBlur={handleBlur}
      onClick={local.onClick}
      onFocus={handleFocus}
    >
      {local.children}
    </PackageButton>
  );
}
