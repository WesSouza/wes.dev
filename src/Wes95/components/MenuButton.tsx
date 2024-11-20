import { createSignal, Show, type JSX } from 'solid-js';
import { createDocumentResizeObserver } from '../hooks/createDocumentResizeObserver';
import type { Anchor } from '../models/Geometry';
import { Menu, type MenuItem, type MenuSeparator } from './Menu';

export const MenuButton = (p: {
  appearance?: 'menu' | 'taskbar' | 'taskbar-start' | undefined;
  children?: JSX.Element;
  items: (MenuItem | MenuSeparator)[];
  onClose?: () => void;
  onOpen?: () => void;
  onSelect: (itemId: string) => void;
}) => {
  let element!: HTMLButtonElement;
  const [anchor, setAnchor] = createSignal<Anchor>();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const toggleMenu = () => {
    const open = !menuOpen();
    setMenuOpen(open);
    if (open) {
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

  createDocumentResizeObserver(() => {
    if (!element) {
      setAnchor(undefined);
      return;
    }

    const rect = element.getBoundingClientRect();

    setAnchor({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      direction: 'block-start',
    });
  });

  return (
    <>
      <button
        type="button"
        classList={{
          MenuButton: p.appearance !== 'taskbar',
          TaskbarButton:
            p.appearance === 'taskbar' || p.appearance === 'taskbar-start',
          '-down': menuOpen(),
          '-start': p.appearance === 'taskbar-start',
        }}
        onClick={toggleMenu}
        ref={element}
      >
        {p.children}
      </button>
      <Show when={menuOpen() && anchor()}>
        <Menu
          items={p.items}
          anchor={anchor()!}
          onClose={closeMenu}
          onSelect={handleSelect}
        />
      </Show>
    </>
  );
};
