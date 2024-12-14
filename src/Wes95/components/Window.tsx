import { createContext, createEffect, lazy, Show, type JSX } from 'solid-js';
import type { z } from 'zod';
import { parseSearchParams } from 'zod-search-params';
import { ScreenManager } from '../lib/ScreenManager';
import type { WindowManager } from '../lib/WindowManager';
import type { Point } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { getRect, parseWindowURL } from '../utils/Windows';
import { Icon } from './Icon';
import { Symbol } from './Symbol';
import { throttleEvent } from '../utils/events';

const ResizeAreaWidth = 12;

const CursorMap: Record<string, string> = {
  nw: 'nwse',
  n: 'ns',
  ne: 'nesw',
  w: 'ew',
  e: 'ew',
  sw: 'nesw',
  s: 'ns',
  se: 'nwse',
};

export const WindowContext = createContext<WindowState>();

export function Window(p: {
  active: boolean;
  window: WindowState;
  windowManager: WindowManager;
  zIndex?: number;
}) {
  const { windowManager } = p;

  let clickOffset: Point | undefined;
  const resizing = {
    x: false,
    y: false,
    offsetX: 0,
    offsetY: 0,
    anchorX: 0,
    anchorY: 0,
  };
  const activePointers = new Set<number>();
  let pointerAction: 'move' | 'resize' | undefined;
  let windowRef!: HTMLElement;
  let windowContentsRef!: HTMLDivElement;

  createEffect(async () => {
    if (!p.window.sizeAutomatic) {
      return;
    }

    const scale = ScreenManager.shared.scale();
    const horizontalOffset = 6 * scale;
    const verticalOffset = 24 * scale;
    const contentsRect = windowContentsRef.getBoundingClientRect();

    windowManager.init(p.window.id, {
      width: contentsRect.width + horizontalOffset,
      height: contentsRect.height + verticalOffset,
    });
  });

  const handleMaximize = () => {
    if (!p.window.maximizable || p.window.parentId || !p.window.showInTaskbar) {
      return;
    }

    const maximized = !p.window.maximized;
    windowManager.setWindowMaximized(p.window.id, maximized);

    if (!p.active && maximized) {
      windowManager.setActiveWindow(p.window);
    }
  };

  const handleMinimize = () => {
    if (!p.window.minimizable || p.window.parentId || !p.window.showInTaskbar) {
      return;
    }

    windowManager.setWindowMinimized(p.window.id, true);
  };

  const handleWindowPointerDown = (
    event: PointerEvent & { target: Element },
  ) => {
    activePointers.add(event.pointerId);

    document.documentElement.addEventListener('pointerup', handlePointerUp);
    document.documentElement.addEventListener(
      'pointercancel',
      handlePointerCancel,
    );

    if (activePointers.size !== 1 || event.button !== 0) {
      return;
    }

    if (!p.active) {
      windowManager.setActiveWindow(p.window);
    }

    // Move
    if (!pointerAction && event.target.closest('[data-window-title-bar]')) {
      const windowRect = windowRef.getBoundingClientRect();
      clickOffset = {
        x: event.clientX - windowRect.x,
        y: event.clientY - windowRect.y,
      };

      pointerAction = 'move';
    }

    // Resize
    if (
      !pointerAction &&
      !p.window.maximized &&
      !p.window.sizeAutomatic &&
      !event.target.closest('button') &&
      !event.target.closest('img')
    ) {
      const rect = getRect(p.window);
      const x = document.documentElement.scrollLeft + event.clientX - rect.x;
      const y = document.documentElement.scrollTop + event.clientY - rect.y;

      if (x <= ResizeAreaWidth) {
        resizing.x = true;
        resizing.anchorX = rect.width + rect.x;
        resizing.offsetX = x;
      }

      if (x >= rect.width - ResizeAreaWidth) {
        resizing.x = true;
        resizing.offsetX = x - rect.width;
      }

      if (y <= ResizeAreaWidth) {
        resizing.y = true;
        resizing.anchorY = rect.height + rect.y;
        resizing.offsetY = y;
      }

      if (y >= rect.height - ResizeAreaWidth) {
        resizing.y = true;
        resizing.offsetY = y - rect.height;
      }

      if (resizing.x || resizing.y) {
        clickOffset = {
          x,
          y,
        };

        pointerAction = 'resize';
      }
    }

    if (pointerAction) {
      document.documentElement.addEventListener(
        'pointermove',
        handlePointerMove,
      );

      event.preventDefault();

      document.documentElement.style.setProperty('touch-action', 'none');
      windowManager.setMovingWindows(true);
    }
  };

  const handlePointerCancel = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);

    if (activePointers.size !== 0) {
      return;
    }

    // Cleanup
    if (pointerAction === 'resize') {
      resizing.x = false;
      resizing.y = false;
      resizing.offsetX = 0;
      resizing.offsetY = 0;
      resizing.anchorX = 0;
      resizing.anchorY = 0;
    }

    document.documentElement.removeEventListener(
      'pointermove',
      handlePointerMove,
    );
    document.documentElement.removeEventListener('pointerup', handlePointerUp);

    pointerAction = undefined;
    windowManager.setMovingWindows(false);
  };

  const handlePointerMove = throttleEvent((event: PointerEvent) => {
    if (activePointers.size > 1 || !pointerAction) {
      return;
    }

    event.preventDefault();

    if (pointerAction === 'move') {
      const position = {
        x: document.documentElement.scrollLeft + event.clientX - clickOffset!.x,
        y: document.documentElement.scrollTop + event.clientY - clickOffset!.y,
      };
      windowManager.setWindowPosition(p.window.id, position);
    }

    if (pointerAction === 'resize') {
      const rect = getRect(p.window);

      const position = {
        x: document.documentElement.scrollLeft + event.clientX - clickOffset!.x,
        y: document.documentElement.scrollTop + event.clientY - clickOffset!.y,
      };

      const size = {
        width: rect.width,
        height: rect.height,
      };

      if (resizing.x) {
        if (resizing.anchorX) {
          size.width = resizing.anchorX - position.x;
        } else {
          size.width =
            document.documentElement.scrollLeft +
            event.clientX -
            rect.x -
            resizing.offsetX;
        }
      }

      if (resizing.y) {
        if (resizing.anchorY) {
          size.height = resizing.anchorY - position.y;
        } else {
          size.height =
            document.documentElement.scrollTop +
            event.clientY -
            rect.y -
            resizing.offsetY;
        }
      }

      windowManager.setWindowSize(
        p.window.id,
        size,
        resizing.anchorX > 0,
        resizing.anchorY > 0,
      );
    }
  });

  const handleWindowPointerMove = throttleEvent((event: PointerEvent) => {
    if (p.window.maximized || p.window.sizeAutomatic) {
      return;
    }

    const rect = getRect(p.window);
    const x = document.documentElement.scrollLeft + event.clientX - rect.x;
    const y = document.documentElement.scrollTop + event.clientY - rect.y;
    let cursor = '';

    if (y <= ResizeAreaWidth) {
      cursor += 'n';
    }

    if (y >= rect.height - ResizeAreaWidth) {
      cursor += 's';
    }

    if (x >= rect.width - ResizeAreaWidth) {
      cursor += 'e';
    }

    if (x <= ResizeAreaWidth) {
      cursor += 'w';
    }

    if (!cursor) {
      windowRef.style.removeProperty('cursor');
    } else {
      windowRef.style.setProperty('cursor', CursorMap[cursor] + '-resize');
    }
  });

  const windowContents = () => {
    const [WindowContentComponent, WindowDataSchema, url, type] =
      parseWindowURL(p.window.url, windowManager.windowLibrary);

    if (!WindowContentComponent) {
      console.error(`[Window] Missing window for URL `, p.window.url);
      return;
    }

    const data: z.infer<typeof WindowDataSchema> =
      // @ts-expect-error
      parseSearchParams(WindowDataSchema, url.searchParams);

    const Component =
      type === 'sync'
        ? (WindowContentComponent as (props: any) => JSX.Element)
        : lazy(
            WindowContentComponent as () => Promise<{
              default: (props: any) => JSX.Element;
            }>,
          );

    return <Component data={data} window={p.window} />;
  };

  return (
    <WindowContext.Provider value={p.window}>
      <section
        classList={{
          Window: true,
          '-active': p.active,
          '-maximized': p.window.maximized,
          '-minimized': p.window.minimized,
        }}
        ref={windowRef}
        onPointerDown={handleWindowPointerDown}
        onPointerMove={handleWindowPointerMove}
        style={{
          opacity: p.window.initialized ? undefined : '0',
          ...(!p.window.maximized
            ? {
                top: `${p.window.y}px`,
                left: `${p.window.x}px`,
                width: `${p.window.width}px`,
                height: `${p.window.height}px`,
              }
            : {}),
          'z-index': p.zIndex,
        }}
      >
        <div class="WindowTitleBar">
          <Show when={p.window.icon}>
            <div class="WindowTitleIcon">
              <Icon icon={p.window.icon!} />
            </div>
          </Show>
          <button
            class="GhostButton WindowTitleText"
            data-window-title-bar
            onDblClick={handleMaximize}
            type="button"
          >
            {p.window.title}
          </button>
          <div class="WindowTitleButtons">
            <Show when={!p.window.parentId && p.window.showInTaskbar}>
              <Show when={p.window.minimizable}>
                <button
                  aria-label="Minimize"
                  type="button"
                  class="WindowTitleButton"
                  onClick={handleMinimize}
                >
                  <Symbol symbol="windowMinimize" />
                </button>
              </Show>
              <Show when={p.window.maximizable}>
                <button
                  aria-label={p.window.maximized ? 'Restore' : 'Maximize'}
                  type="button"
                  class="WindowTitleButton"
                  onClick={handleMaximize}
                >
                  <Symbol
                    symbol={
                      p.window.maximized ? 'windowRestore' : 'windowMaximize'
                    }
                  />
                </button>
              </Show>
            </Show>
            <button
              aria-label="Close"
              type="button"
              class="WindowTitleButton"
              onClick={() => windowManager.closeWindow(p.window.id)}
            >
              <Symbol symbol="windowClose" />
            </button>
          </div>
        </div>
        <div
          ref={windowContentsRef}
          classList={{
            WindowContent: true,
            SmallSpacing: true,
            '-grow': !p.window.sizeAutomatic,
          }}
        >
          {windowContents()}
        </div>
        <div class="WindowResize"></div>
      </section>
    </WindowContext.Provider>
  );
}
