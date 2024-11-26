import { createMemo, createSignal, onMount, Show } from 'solid-js';
import { createDocumentResizeObserver } from '../hooks/createDocumentResizeObserver';
import type { Anchor } from '../models/Geometry';
import { Icon } from './Icon';
import { Menu, type MenuItem, type MenuSeparator } from './Menu';
import { Symbol } from './Symbol';
import { createResizeObserver } from '@solid-primitives/resize-observer';

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
        classList={{
          Field: true,
          Combobox: true,
          '-icon': p.appearance === 'icon',
        }}
        ref={anchorElement}
      >
        <div class="ComboboxValue Horizontal SmallSpacing -center">
          <Show when={p.appearance === 'icon' && item()?.icon}>
            <Icon icon={item()!.icon!} />
          </Show>
          <span>{item()?.label ?? p.placeholder}</span>
        </div>
        <button
          type="button"
          class="ComboboxButton TaskbarButton"
          onClick={toggleMenu}
        >
          <Symbol symbol="chevronDown" />
        </button>
      </div>
      <Show when={menuOpen() && anchor()}>
        <Menu
          appearance="listbox"
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
