import type { WindowManager } from '../lib/WindowManager';
import type { Point } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { Show, type JSX } from 'solid-js';
import { Symbol } from './Symbol';
import { Icon } from './Icon';
import { parseSearchParams } from 'zod-search-params';

export function Window(p: {
  active: boolean;
  window: WindowState;
  windowManager: WindowManager;
  zIndex?: number | undefined;
}) {
  const { windowManager } = p;

  let clickOffset: Point | undefined;
  const activePointers = new Set<number>();
  let windowRef!: HTMLElement;

  const handleMaximize = () => {
    if (p.window.parentId || !p.window.showInTaskbar) {
      return;
    }

    const maximized = !p.window.maximized;
    windowManager.setWindowMaximized(p.window.id, maximized);

    if (!p.active && maximized) {
      windowManager.setActiveWindow(p.window);
    }
  };

  const handleWindowPointerDown: JSX.EventHandler<HTMLElement, PointerEvent> = (
    event,
  ) => {
    if (p.active || event.target.closest('button')) {
      return;
    }

    windowManager.setActiveWindow(p.window);
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
      event.target.closest('img')
    ) {
      return;
    }

    event.preventDefault();

    if (p.window.maximized) {
      return;
    }

    document.documentElement.style.setProperty('overscroll-behavior', 'none');
    document.documentElement.style.setProperty('touch-action', 'none');

    const windowRect = windowRef.getBoundingClientRect();
    clickOffset = {
      x: event.clientX - windowRect.x,
      y: event.clientY - windowRect.y,
    };

    document.documentElement.addEventListener(
      'pointermove',
      handlePointerMove,
      { passive: false },
    );
    document.documentElement.addEventListener(
      'pointerdown',
      handlePointerDown,
      { passive: false },
    );
    document.documentElement.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDown = (event: PointerEvent) => {
    activePointers.add(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
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

  const handlePointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);

    document.documentElement.removeEventListener(
      'pointermove',
      handlePointerMove,
    );
    document.documentElement.style.removeProperty('overscroll-behavior');
    document.documentElement.style.removeProperty('touch-action');

    if (activePointers.size === 1) {
      document.documentElement.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );
      document.documentElement.removeEventListener(
        'pointerup',
        handlePointerUp,
      );
    }
  };

  const windowContents = () => {
    const url = new URL(p.window.url);
    const programName = url.hostname;
    const windowName = url.pathname.replace(/^\//, '').replace(/\\/g, '_');
    // @ts-expect-error
    const data: z.infer<p.window.dataSchema> = parseSearchParams(
      // @ts-expect-error
      p.window.dataSchema,
      url.searchParams,
    );

    const program = windowManager.windowLibrary[programName];
    if (!program || typeof program !== 'object') {
      console.error(
        `[Window] Missing program ${programName} for URL `,
        url.toString(),
      );
      return;
    }

    const WindowContentComponent = program[windowName];
    if (
      !WindowContentComponent ||
      typeof WindowContentComponent !== 'function'
    ) {
      console.error(
        `[Window] Missing window ${windowName} for URL `,
        url.toString(),
      );
      return;
    }

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
      style={{
        ...(!p.window.maximized
          ? {
              top: `${p.window.rect.y}px`,
              left: `${p.window.rect.x}px`,
              width: `${p.window.rect.width}px`,
              height: `${p.window.rect.height}px`,
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
            <button
              type="button"
              class="WindowTitleButton"
              onClick={() =>
                windowManager.setWindowMinimized(p.window.id, true)
              }
            >
              <Symbol symbol="windowMinimize" />
            </button>
            <button
              type="button"
              class="WindowTitleButton"
              onClick={handleMaximize}
            >
              <Symbol
                symbol={p.window.maximized ? 'windowRestore' : 'windowMaximize'}
              />
            </button>
          </Show>
          <button
            type="button"
            class="WindowTitleButton"
            onClick={() => windowManager.closeWindow(p.window.id)}
          >
            <Symbol symbol="windowClose" />
          </button>
        </div>
      </div>
      <div class="WindowContent SmallSpacing">{windowContents()}</div>
      <div class="WindowResize"></div>
    </section>
  );
}
