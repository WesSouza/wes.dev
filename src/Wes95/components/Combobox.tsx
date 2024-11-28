import { createResizeObserver } from '@solid-primitives/resize-observer';
import {
  createMemo,
  createSignal,
  createUniqueId,
  onMount,
  Show,
} from 'solid-js';
import { createDocumentResizeObserver } from '../hooks/createDocumentResizeObserver';
import type { Anchor } from '../models/Geometry';
import { Icon } from './Icon';
import { Menu, type MenuItem, type MenuSeparator } from './Menu';
import { Symbol } from './Symbol';

export const Combobox = (p: {
  appearance?: 'simple' | 'icon';
  items: (MenuItem | MenuSeparator)[];
  onClose?: () => void;
  onOpen?: () => void;
  onChange?: (itemId: string) => void;
  selectedItem?: string;
  placeholder?: string;
}) => {
  let anchorElement!: HTMLDivElement;
  const menuButtonId = createUniqueId();
  const menuId = createUniqueId();
  const [anchor, setAnchor] = createSignal<Anchor>();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const item = createMemo<MenuItem | undefined>(
    () =>
      p.items.find(
        (item) => item.type === 'item' && item.id === p.selectedItem,
      ) as MenuItem,
  );

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
    p.onChange?.(itemId);
    closeMenu();
  };

  const updateAnchor = () => {
    if (!anchorElement) {
      setAnchor(undefined);
      return;
    }

    const rect = anchorElement.getBoundingClientRect();

    setAnchor({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      direction: 'block-start',
    });
  };

  onMount(() => {
    createDocumentResizeObserver(updateAnchor);
    createResizeObserver(anchorElement, updateAnchor);
  });

  return (
    <>
      <div
        aria-expanded={menuOpen() && anchor() ? 'true' : undefined}
        aria-haspopup="dialog"
        aria-controls={menuOpen() && anchor() ? menuId : undefined}
        classList={{
          Field: true,
          Combobox: true,
          '-icon': p.appearance === 'icon',
        }}
        id={menuButtonId}
        ref={anchorElement}
        role="combobox"
        onClick={toggleMenu}
      >
        <div class="ComboboxValue Horizontal SmallSpacing -center">
          <Show when={p.appearance === 'icon' && item()?.icon}>
            <Icon icon={item()!.icon!} />
          </Show>
          <span>{item()?.label ?? p.placeholder}</span>
        </div>
        <button type="button" class="ComboboxButton TaskbarButton">
          <Symbol symbol="chevronDown" />
        </button>
      </div>
      <Show when={menuOpen() && anchor()}>
        <Menu
          aria-labelledby={menuButtonId}
          appearance="listbox"
          id={menuId}
          items={p.items}
          anchor={anchor()!}
          anchorWidth
          onClose={closeMenu}
          onSelect={handleSelect}
        />
      </Show>
    </>
  );
};
