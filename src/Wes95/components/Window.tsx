import { createEffect, Show, type JSX } from 'solid-js';
import type { z } from 'zod';
import { parseSearchParams } from 'zod-search-params';
import { ScreenManager } from '../lib/ScreenManager';
import type { WindowManager } from '../lib/WindowManager';
import type { Point } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { getRect, parseWindowURL } from '../utils/Windows';
import { Icon } from './Icon';
import { Symbol } from './Symbol';

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

    windowManager.place(p.window.id, {
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

  const handleWindowPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (
    event,
  ) => {
    activePointers.add(event.pointerId);
    if (
      p.window.maximized ||
      p.window.sizeAutomatic ||
      activePointers.size !== 1 ||
      event.button !== 0 ||
      event.target.closest('button') ||
      event.target.closest('img')
    ) {
      return;
    }

    if (!p.active) {
      windowManager.setActiveWindow(p.window);
    }

    event.preventDefault();

    const rect = getRect(p.window);
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;

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

    if (!resizing.x && !resizing.y) {
      return;
    }

    clickOffset = {
      x,
      y,
    };

    document.documentElement.style.setProperty('touch-action', 'none');

    document.documentElement.addEventListener(
      'pointermove',
      handleResizingPointerMove,
      { passive: false },
    );
    document.documentElement.addEventListener(
      'pointerdown',
      handleResizingPointerDown,
      { passive: false },
    );
    document.documentElement.addEventListener(
      'pointerup',
      handleResizingPointerUp,
    );

    windowManager.setMovingWindows(true);
  };

  const handleWindowPointerMove: JSX.EventHandler<HTMLElement, PointerEvent> = (
    event,
  ) => {
    if (p.window.maximized || p.window.sizeAutomatic) {
      return;
    }

    const rect = getRect(p.window);
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;
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
  };

  const handleResizingPointerDown = (event: PointerEvent) => {
    activePointers.add(event.pointerId);
  };

  const handleResizingPointerMove = (event: PointerEvent) => {
    if (activePointers.size > 1) {
      return;
    }

    event.preventDefault();

    const rect = getRect(p.window);

    const position = {
      x: event.clientX - clickOffset!.x,
      y: event.clientY - clickOffset!.y,
    };

    const size = {
      width: rect.width,
      height: rect.height,
    };

    if (resizing.x) {
      if (resizing.anchorX) {
        size.width = resizing.anchorX - position.x;
      } else {
        size.width = event.clientX - rect.x - resizing.offsetX;
      }
    }

    if (resizing.y) {
      if (resizing.anchorY) {
        size.height = resizing.anchorY - position.y;
      } else {
        size.height = event.clientY - rect.y - resizing.offsetY;
      }
    }

    windowManager.setWindowSize(
      p.window.id,
      size,
      Boolean(resizing.anchorX || resizing.anchorY),
    );
  };

  const handleResizingPointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);

    resizing.x = false;
    resizing.y = false;
    resizing.offsetX = 0;
    resizing.offsetY = 0;
    resizing.anchorX = 0;
    resizing.anchorY = 0;

    document.documentElement.removeEventListener(
      'pointermove',
      handleResizingPointerMove,
    );
    document.documentElement.style.removeProperty('touch-action');

    if (activePointers.size === 1) {
      document.documentElement.removeEventListener(
        'pointerdown',
        handleResizingPointerDown,
      );
      document.documentElement.removeEventListener(
        'pointerup',
        handleResizingPointerUp,
      );
    }

    windowManager.setMovingWindows(false);
  };

  const handleTitlePointerDown: JSX.EventHandler<
    HTMLDivElement,
    PointerEvent
  > = (event) => {
    activePointers.add(event.pointerId);
    if (
      activePointers.size !== 1 ||
      event.button !== 0 ||
      event.target.closest('button') ||
      event.target.closest('img') ||
      resizing.x ||
      resizing.y ||
      p.window.maximized
    ) {
      return;
    }

    event.preventDefault();

    document.documentElement.style.setProperty('touch-action', 'none');

    const windowRect = windowRef.getBoundingClientRect();
    clickOffset = {
      x: event.clientX - windowRect.x,
      y: event.clientY - windowRect.y,
    };

    document.documentElement.addEventListener(
      'pointermove',
      handleMovingPointerMove,
      { passive: false },
    );
    document.documentElement.addEventListener(
      'pointerdown',
      handleMovingPointerDown,
      { passive: false },
    );
    document.documentElement.addEventListener(
      'pointerup',
      handleMovingPointerUp,
    );

    windowManager.setMovingWindows(true);
  };

  const handleMovingPointerDown = (event: PointerEvent) => {
    activePointers.add(event.pointerId);
  };

  const handleMovingPointerMove = (event: PointerEvent) => {
    if (activePointers.size > 1) {
      return;
    }

    event.preventDefault();

    const position = {
      x: event.clientX - clickOffset!.x,
      y: event.clientY - clickOffset!.y,
    };
    windowManager.setWindowPosition(p.window.id, position);
  };

  const handleMovingPointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);

    document.documentElement.removeEventListener(
      'pointermove',
      handleMovingPointerMove,
    );
    document.documentElement.style.removeProperty('touch-action');

    if (activePointers.size === 1) {
      document.documentElement.removeEventListener(
        'pointerdown',
        handleMovingPointerDown,
      );
      document.documentElement.removeEventListener(
        'pointerup',
        handleMovingPointerUp,
      );
    }
    windowManager.setMovingWindows(false);
  };

  const windowContents = () => {
    const [WindowContentComponent, WindowDataSchema, url] = parseWindowURL(
      p.window.url,
      windowManager.windowLibrary,
    );

    if (!WindowContentComponent) {
      console.error(`[Window] Missing window for URL `, p.window.url);
      return;
    }

    const data: z.infer<typeof WindowDataSchema> =
      // @ts-expect-error
      parseSearchParams(WindowDataSchema, url.searchParams);

    return <WindowContentComponent data={data} window={p.window} />;
  };

  return (
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
      <div
        class="WindowTitleBar"
        onPointerDown={handleTitlePointerDown}
        onDblClick={handleMaximize}
      >
        <Show when={p.window.icon}>
          <div class="WindowTitleIcon">
            <Icon icon={p.window.icon!} />
          </div>
        </Show>
        <div class="WindowTitleText">{p.window.title}</div>
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
  );
}
