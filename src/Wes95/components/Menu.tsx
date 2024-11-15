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

export function Menu(p: {
  anchor: Anchor;
  iconSizes?: 'small' | 'large' | undefined;
  items: (MenuItem | MenuSeparator)[];
  onClose?: () => void;
  onSelect: (itemId: string) => void;
}) {
  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    opacity: 0,
  });
  const [submenu, setSubmenu] = createStore<{
    anchor: Anchor | undefined;
    items: (MenuItem | MenuSeparator)[] | undefined;
  }>({
    anchor: undefined,
    items: undefined,
  });

  let menuElement!: HTMLMenuElement;
  const areaEl = document.documentElement;

  const handleClick = (item: MenuItem, element: HTMLElement) => {
    if (item.disabled) {
      return;
    }

    if (item.submenu) {
      setSubmenu({
        anchor: element.getBoundingClientRect(),
        items: item.submenu,
      });
      return;
    }

    p.onSelect(item.id);
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

  return (
    <menu class="Menu" popover ref={menuElement} style={style()}>
      <For each={p.items}>
        {(item) =>
          item.type === 'separator' ? (
            <hr class="HorizontalSeparator" />
          ) : (
            <li
              class="MenuItem"
              onClick={(event) => handleClick(item, event.currentTarget)}
            >
              <span
                classList={{
                  MenuIcon: true,
                  '-large': p.iconSizes === 'large',
                }}
              >
                <Switch>
                  <Match when={item.checked === 'checkmark'}>
                    <Symbol symbol="chevronRight" />
                  </Match>
                  <Match when={item.checked === 'radio'}>
                    <Symbol symbol="chevronLeft" />
                  </Match>
                  <Match when={item.icon !== undefined}>
                    <Icon icon={item.icon!} size={p.iconSizes} />
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
        />
      </Show>
    </menu>
  );
}
