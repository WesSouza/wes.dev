import { For } from 'solid-js';
import { type MenuItem } from './Menu';
import { MenuButton } from './MenuButton';

export const MenuBar = (p: {
  items: MenuItem[];
  onSelect: (itemId: string) => void;
}) => {
  return (
    <div>
      <For each={p.items}>
        {(item) => (
          <MenuButton
            appearance="menu"
            items={item.submenu!}
            onSelect={p.onSelect}
          >
            {item.label}
          </MenuButton>
        )}
      </For>
    </div>
  );
};
