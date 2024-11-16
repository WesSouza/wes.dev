import {
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  Show,
  Switch,
  type JSX,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Anchor } from '../models/Geometry';
import { Icon } from './Icon';
import { Symbol } from './Symbol';

const InlineMenuOffsetBlock = -8;
const InlineMenuOffsetInline = -6;

export type MenuSeparator = {
  type: 'separator';
};

export type MenuItem = {
  type: 'item';
  id: string;
  label: string;
  icon?: string | undefined;
  checked?: 'checkmark' | 'radio' | undefined;
  disabled?: boolean | undefined;
  submenu?: (MenuItem | MenuSeparator)[] | undefined;
};

function menuItemAbove(items: (MenuItem | MenuSeparator)[], index: number) {
  let indexAbove = index <= 0 ? items.length - 1 : index - 1;
  while (items[indexAbove] && items[indexAbove]?.type !== 'item') {
    indexAbove -= 1;
  }
  return items[indexAbove] ? indexAbove : -1;
}

function menuItemBelow(items: (MenuItem | MenuSeparator)[], index: number) {
  let indexBelow = index >= items.length - 1 ? 0 : index + 1;
  while (items[indexBelow] && items[indexBelow]?.type !== 'item') {
    indexBelow += 1;
  }
  return items[indexBelow] ? indexBelow : -1;
}

export function Menu(p: {
  anchor: Anchor;
  items: (MenuItem | MenuSeparator)[];
  onClose?: () => void;
  onSelect: (itemId: string) => void;
}) {
  let timer: number | undefined;
  const itemRefs: HTMLElement[] = [];
  const [activeIndex, setActiveIndex] = createSignal<number | undefined>();
  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    opacity: 0,
  });
  const [submenu, setSubmenu] = createStore<{
    anchor: Anchor | undefined;
    index: number | undefined;
    items: (MenuItem | MenuSeparator)[] | undefined;
  }>({
    anchor: undefined,
    index: undefined,
    items: undefined,
  });

  let menuElement!: HTMLMenuElement;
  const areaEl = document.documentElement;

  const handleClick = (index: number, element: HTMLElement) => {
    const item = p.items[index];
    if (!item || item.type !== 'item' || item.disabled) {
      return;
    }

    if (item.submenu) {
      setSubmenu({
        anchor: element.getBoundingClientRect(),
        index: index,
        items: item.submenu,
      });
      return;
    }

    p.onSelect(item.id);
  };

  const handleSubmenuClose = () => {
    setSubmenu({
      anchor: undefined,
      index: undefined,
      items: undefined,
    });
  };

  const handleClose = (event: Event) => {
    if (event instanceof ToggleEvent && event.newState === 'closed') {
      p.onClose?.();
    }
  };

  createEffect(async () => {
    const anchor = p.anchor;

    if (!menuElement) {
      return;
    }

    menuElement.showPopover();
    const areaRect = areaEl.getBoundingClientRect();
    const rect = menuElement.getBoundingClientRect();

    const directionInline = anchor.direction?.startsWith('inline') ?? true;
    const directionStart = anchor.direction?.endsWith('start') ?? false;

    const axisPositionProp = directionInline ? 'x' : 'y';
    const axisDimensionProp = directionInline ? 'width' : 'height';
    const orthogonalAxisPositionProp = !directionInline ? 'x' : 'y';
    const orthogonalAxisDimensionProp = !directionInline ? 'width' : 'height';

    let axisPosition =
      (directionStart
        ? anchor[axisPositionProp] - rect[axisDimensionProp]
        : anchor[axisPositionProp] + anchor[axisDimensionProp]) +
      (directionInline ? InlineMenuOffsetInline : 0);
    let orthogonalAxisPosition =
      anchor[orthogonalAxisPositionProp] +
      (directionInline ? InlineMenuOffsetBlock : 0);

    if (
      axisPosition < 0 ||
      axisPosition + rect[axisDimensionProp] > areaRect[axisDimensionProp]
    ) {
      axisPosition = !directionStart
        ? anchor[axisPositionProp] - rect[axisDimensionProp]
        : anchor[axisPositionProp] + anchor[axisDimensionProp];
    }

    if (
      axisPosition < 0 ||
      axisPosition + rect[axisDimensionProp] > areaRect[axisDimensionProp]
    ) {
      axisPosition = !directionStart
        ? areaRect[axisDimensionProp] - rect[axisDimensionProp]
        : 0;
    }

    if (
      orthogonalAxisPosition + rect[orthogonalAxisDimensionProp] >
      areaRect[orthogonalAxisDimensionProp]
    ) {
      orthogonalAxisPosition =
        areaRect[orthogonalAxisDimensionProp] -
        rect[orthogonalAxisDimensionProp];
    }

    setStyle({
      top: `${directionInline ? orthogonalAxisPosition : axisPosition}px`,
      left: `${!directionInline ? orthogonalAxisPosition : axisPosition}px`,
      opacity: 1,
    });

    menuElement.addEventListener('toggle', handleClose);

    onCleanup(() => {
      menuElement.removeEventListener('toggle', handleClose);
      menuElement.hidePopover();
    });
  });

  createEffect(() => {
    const handleDocumentKeyUp = (event: KeyboardEvent) => {
      if (submenu.items) {
        return;
      }

      const currentIndex = activeIndex();
      const lastIndex = p.items.length - 1;

      switch (event.key) {
        case 'ArrowUp': {
          setActiveIndex(menuItemAbove(p.items, currentIndex ?? 0));
          break;
        }

        case 'ArrowDown': {
          setActiveIndex(menuItemBelow(p.items, currentIndex ?? lastIndex));
          break;
        }

        case 'ArrowRight': {
          const item = p.items[currentIndex!];
          const itemRef = itemRefs[currentIndex!];
          if (item && item.type === 'item' && item.submenu && itemRef) {
            setSubmenu({
              anchor: itemRef.getBoundingClientRect(),
              index: currentIndex,
              items: item.submenu,
            });
          }
          break;
        }

        case 'ArrowLeft': {
          p.onClose?.();
          break;
        }
      }
    };

    document.documentElement.addEventListener('keyup', handleDocumentKeyUp);

    onCleanup(() => {
      document.documentElement.removeEventListener(
        'keyup',
        handleDocumentKeyUp,
      );
    });
  });

  const handleItemMouseEnter = (
    index: number,
    currentTarget: HTMLLIElement,
  ) => {
    setActiveIndex(index);
    const item = p.items[index];
    window.clearTimeout(timer);
    const anchor = currentTarget.getBoundingClientRect();
    timer = window.setTimeout(() => {
      if (item && item.type === 'item' && item.submenu) {
        setSubmenu({
          anchor,
          index,
          items: item.submenu,
        });
      } else {
        setSubmenu({
          anchor: undefined,
          index: undefined,
          items: undefined,
        });
      }
    }, 450);
  };

  const handleItemMouseLeave = () => {
    setActiveIndex(submenu.index !== undefined ? submenu.index : undefined);
    window.clearTimeout(timer);
  };

  return (
    <menu class="Menu" popover ref={menuElement} style={style()}>
      <For each={p.items}>
        {(item, index) =>
          item.type === 'separator' ? (
            <hr
              class="HorizontalSeparator"
              ref={(el) => (itemRefs[index()] = el)}
            />
          ) : (
            <li
              classList={{
                MenuItem: true,
                '-active': activeIndex() === index(),
                '-disabled': item.disabled,
              }}
              onClick={(event) => handleClick(index(), event.currentTarget)}
              onMouseEnter={(event) =>
                handleItemMouseEnter(index(), event.currentTarget)
              }
              onMouseLeave={handleItemMouseLeave}
              ref={(el) => (itemRefs[index()] = el)}
            >
              <span class="MenuIcon">
                <Switch>
                  <Match when={item.checked === 'checkmark'}>
                    <Symbol symbol="chevronRight" />
                  </Match>
                  <Match when={item.checked === 'radio'}>
                    <Symbol symbol="chevronLeft" />
                  </Match>
                  <Match when={item.icon !== undefined}>
                    <Icon icon={item.icon!} />
                  </Match>
                </Switch>
              </span>
              <span class="MenuLabel">{item.label}</span>

              <span class="MenuChevron">
                <Show when={item.submenu !== undefined}>
                  <Symbol symbol="chevronRight" />
                </Show>
              </span>
            </li>
          )
        }
      </For>
      <Show when={submenu.items && submenu.anchor}>
        <Menu
          items={submenu.items!}
          anchor={submenu.anchor!}
          onSelect={p.onSelect}
          onClose={handleSubmenuClose}
        />
      </Show>
    </menu>
  );
}
