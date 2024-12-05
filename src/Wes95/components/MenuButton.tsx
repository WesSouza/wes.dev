import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from 'solid-js';
import type { Anchor } from '../models/Geometry';
import { Menu, type MenuItem, type MenuSeparator } from './Menu';
import { WindowManager } from '../lib/WindowManager';

export const MenuButton = (p: {
  appearance?: 'menu' | 'taskbar' | 'taskbar-start';
  children?: JSX.Element;
  direction?: 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
  items: (MenuItem | MenuSeparator)[];
  onButtonMouseEnter?: () => void;
  onButtonMouseLeave?: () => void;
  onClose?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onOpen?: () => void;
  onSelect: (itemId: string) => void;
  open?: boolean;
}) => {
  let element!: HTMLButtonElement;
  const menuButtonId = createUniqueId();
  const menuId = createUniqueId();

  const [anchor, setAnchor] = createSignal<Anchor>();
  const [internalMenuOpen, setMenuOpen] = createSignal(false);

  createEffect(() => {
    if (!WindowManager.shared.state.movingWindows && !menuOpen()) {
      reposition();
    }

    if (WindowManager.shared.state.movingWindows && menuOpen()) {
      closeMenu();
    }
  });

  const menuOpen = createMemo(() => p.open ?? internalMenuOpen());

  const reposition = () => {
    const rect = element.getBoundingClientRect();

    setAnchor({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      direction: p.direction ?? 'block-end',
    });
  };

  createEffect(async () => {
    await Promise.resolve();
    reposition();
  });

  onMount(() => {
    document.body.addEventListener('mousedown', handleDocumentMouseDown);
    onCleanup(() => {
      document.body.removeEventListener('mousedown', handleDocumentMouseDown);
    });
  });

  const handleDocumentMouseDown = (event: MouseEvent) => {
    if (
      menuOpen() &&
      event.target instanceof HTMLElement &&
      !element.contains(event.target) &&
      !event.target.closest(`[data-menu-id="${menuId}"]`)
    ) {
      closeMenu();
    }
  };

  const toggleMenu = () => {
    const open = !menuOpen();
    setMenuOpen(open);
    if (open) {
      reposition();
      p.onOpen?.();
    } else {
      p.onClose?.();
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    p.onClose?.();
  };

  const handleSelect = (itemId: string) => {
    p.onSelect(itemId);
    closeMenu();
  };

  return (
    <>
      <button
        aria-controls={menuOpen() ? menuId : undefined}
        aria-expanded={menuOpen() ? 'true' : undefined}
        aria-haspopup={'menu'}
        classList={{
          MenuButton: p.appearance !== 'taskbar',
          TaskbarButton:
            p.appearance === 'taskbar' || p.appearance === 'taskbar-start',
          '-down': menuOpen(),
          '-start': p.appearance === 'taskbar-start',
        }}
        id={menuButtonId}
        onClick={toggleMenu}
        onMouseEnter={p.onButtonMouseEnter}
        onMouseLeave={p.onButtonMouseLeave}
        ref={element}
        type="button"
      >
        {p.children}
      </button>
      <Show when={menuOpen() && anchor()}>
        <Menu
          aria-labelledby={menuButtonId}
          anchor={anchor}
          items={p.items}
          id={menuId}
          menuId={menuId}
          onClose={closeMenu}
          onMoveLeft={p.onMoveLeft}
          onMoveRight={p.onMoveRight}
          onSelect={handleSelect}
        />
      </Show>
    </>
  );
};
