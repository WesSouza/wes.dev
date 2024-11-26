import { createSignal, For } from 'solid-js';
import { type MenuItem } from './Menu';
import { MenuButton } from './MenuButton';

export const MenuBar = (p: {
  items: MenuItem[];
  onSelect: (itemId: string) => void;
}) => {
  const [menuOpen, setMenuOpen] = createSignal<number | undefined>();

  const openPrevious = () => {
    let previous = (menuOpen() ?? 0) - 1;
    if (previous < 0) {
      previous = p.items.length - 1;
    }

    setMenuOpen(previous);
  };

  const openNext = () => {
    let next = (menuOpen() ?? 0) + 1;
    if (next >= p.items.length) {
      next = 0;
    }

    setMenuOpen(next);
  };

  return (
    <div class="MenuBar">
      <For each={p.items}>
        {(item, index) => (
          <MenuButton
            appearance="menu"
            items={item.submenu!}
            onSelect={p.onSelect}
            onOpen={() => setMenuOpen(index())}
            onClose={() => setMenuOpen(undefined)}
            onMoveLeft={() => openPrevious()}
            onMoveRight={() => openNext()}
            open={menuOpen() === index()}
          >
            {item.label}
          </MenuButton>
        )}
      </For>
    </div>
  );
};
