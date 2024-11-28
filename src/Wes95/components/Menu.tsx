import {
  createEffect,
  createSignal,
  createUniqueId,
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
import { ScreenManager } from '../lib/ScreenManager';

export type MenuSeparator = {
  type: 'separator';
};

export type MenuItem = {
  type: 'item';
  id: string;
  checked?: 'checkmark' | 'radio';
  disabled?: boolean;
  icon?: string;
  indentLevel?: number;
  label: string;
  submenu?: (MenuItem | MenuSeparator)[];
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
  'aria-labelledby'?: string;
  appearance?: 'listbox' | 'menu';
  activeFirstItem?: boolean;
  anchor: Anchor;
  anchorWidth?: boolean;
  items: (MenuItem | MenuSeparator)[];
  id?: string;
  menuId?: string;
  onClose?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onSelect: (itemId: string) => void;
}) {
  let didMove = false;
  let timer: number | undefined;
  const itemRefs: HTMLElement[] = [];
  const [activeIndex, setActiveIndex] = createSignal<number | undefined>(
    p.activeFirstItem ? menuItemBelow(p.items, -1) : undefined,
  );
  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    opacity: 0,
  });
  const [submenu, setSubmenu] = createStore<{
    anchor: Anchor | undefined;
    id: string | undefined;
    index: number | undefined;
    items: (MenuItem | MenuSeparator)[] | undefined;
    activeFirstItem: boolean;
  }>({
    anchor: undefined,
    id: undefined,
    index: undefined,
    items: undefined,
    activeFirstItem: false,
  });

  const scale = ScreenManager.shared.scale;

  const inlineMenuOffsetBlock = scale() * -4;
  const inlineMenuOffsetInline = scale() * -3;

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
        id: createUniqueId(),
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
      id: undefined,
      index: undefined,
      items: undefined,
    });
  };

  const handleClose = (event: Event) => {
    if (
      event instanceof ToggleEvent &&
      event.newState === 'closed' &&
      !didMove
    ) {
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
      (directionInline ? inlineMenuOffsetInline : 0);
    let orthogonalAxisPosition =
      anchor[orthogonalAxisPositionProp] +
      (directionInline ? inlineMenuOffsetBlock : 0);

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
      width: p.anchorWidth ? `${anchor.width}px` : undefined,
      opacity: 1,
    });

    menuElement.addEventListener('toggle', handleClose);

    onCleanup(() => {
      menuElement.removeEventListener('toggle', handleClose);
      menuElement.hidePopover();
    });
  });

  createEffect(() => {
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
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
              activeFirstItem: true,
              anchor: itemRef.getBoundingClientRect(),
              id: createUniqueId(),
              index: currentIndex,
              items: item.submenu,
            });
          } else {
            if (p.onMoveRight) {
              didMove = true;
              p.onMoveRight();
            }
          }
          break;
        }

        case 'ArrowLeft': {
          if (p.onMoveLeft) {
            didMove = true;
            p.onMoveLeft();
          } else {
            p.onClose?.();
          }
          break;
        }
      }
    };

    document.documentElement.addEventListener('keydown', handleDocumentKeyDown);

    onCleanup(() => {
      document.documentElement.removeEventListener(
        'keydown',
        handleDocumentKeyDown,
      );
    });
  });

  const activeDescendant = () => {
    const index = activeIndex()!;
    const item = p.items[index];
    if (index !== undefined && item && item.type === 'item') {
      return p.id + ':' + index;
    }

    return;
  };

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
          id: createUniqueId(),
          items: item.submenu,
        });
      } else {
        setSubmenu({
          anchor: undefined,
          id: undefined,
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
    <menu
      aria-orientation="vertical"
      aria-activedescendant={activeDescendant()}
      aria-labelledby={p['aria-labelledby']}
      classList={{
        Menu: true,
        '-listBox': p.appearance === 'listbox',
      }}
      id={p.id}
      data-menu-id={p.menuId}
      popover
      ref={menuElement}
      style={style()}
    >
      <For each={p.items}>
        {(item, index) =>
          item.type === 'separator' ? (
            <hr
              class="HorizontalSeparator"
              ref={(el) => (itemRefs[index()] = el)}
              role="separator"
            />
          ) : (
            <li
              aria-disabled={item.disabled ? 'true' : undefined}
              aria-controls={submenu.id}
              aria-expanded={item.submenu && submenu.id ? 'true' : undefined}
              aria-haspopup={
                item.submenu
                  ? p.appearance === 'listbox'
                    ? 'dialog'
                    : 'menu'
                  : undefined
              }
              classList={{
                MenuItem: true,
                '-active': activeIndex() === index(),
                '-disabled': item.disabled,
              }}
              id={p.id + ':' + index()}
              role={p.appearance === 'listbox' ? 'option' : 'menuitem'}
              onClick={(event) => handleClick(index(), event.currentTarget)}
              onMouseEnter={(event) =>
                handleItemMouseEnter(index(), event.currentTarget)
              }
              onMouseLeave={handleItemMouseLeave}
              ref={(el) => (itemRefs[index()] = el)}
              style={{ '--wes95-menu-indent': item.indentLevel }}
            >
              <span class="MenuIcon">
                <Switch>
                  <Match when={item.checked === 'checkmark'}>
                    <Symbol symbol="checkmark" />
                  </Match>
                  <Match when={item.checked === 'radio'}>
                    <Symbol symbol="radio" />
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
      <Show when={submenu.id && submenu.items && submenu.anchor}>
        <Menu
          aria-labelledby={p.id}
          activeFirstItem={submenu.activeFirstItem}
          anchor={submenu.anchor!}
          items={submenu.items!}
          id={submenu.id}
          menuId={p.menuId}
          onClose={handleSubmenuClose}
          onMoveRight={p.onMoveRight}
          onSelect={p.onSelect}
        />
      </Show>
    </menu>
  );
}
