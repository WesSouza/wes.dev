import { createSignal, For } from 'solid-js';
import { type MenuItem } from './Menu';
import { MenuButton } from './MenuButton';

export const MenuBar = (p: {
  items: MenuItem[];
  onSelect: (itemId: string) => void;
}) => {
  const [openIndex, setOpenIndex] = createSignal<number | undefined>();

  const openPrevious = () => {
    let previous = (openIndex() ?? 0) - 1;
    if (previous < 0) {
      previous = p.items.length - 1;
    }

    setOpenIndex(previous);
  };

  const openNext = () => {
    let next = (openIndex() ?? 0) + 1;
    if (next >= p.items.length) {
      next = 0;
    }

    setOpenIndex(next);
  };

  const handleButtonMouseEnter = (index: number) => {
    if (openIndex() !== undefined) {
      setOpenIndex(index);
    }
  };

  return (
    <div class="MenuBar">
      <For each={p.items}>
        {(item, index) => (
          <MenuButton
            appearance="menu"
            items={item.submenu!}
            onSelect={p.onSelect}
            onButtonMouseEnter={() => handleButtonMouseEnter(index())}
            onOpen={() => setOpenIndex(index())}
            onClose={() => setOpenIndex(undefined)}
            onMoveLeft={openPrevious}
            onMoveRight={openNext}
            open={openIndex() === index()}
          >
            {item.label}
          </MenuButton>
        )}
      </For>
    </div>
  );
};
