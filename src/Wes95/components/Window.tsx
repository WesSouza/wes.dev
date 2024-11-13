import type { JSX } from 'solid-js/jsx-runtime';
import type { WindowManager } from '../lib/WindowManager';
import type { Point } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { Show } from 'solid-js';

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
    if (activePointers.size !== 1) {
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
      <div class="WindowTitleBar">
        <div class="WindowTitleIcon"></div>
        <div
          class="WindowTitleText"
          onPointerDown={handleTitlePointerDown}
          onDblClick={handleMaximize}
        >
          {p.window.title}
        </div>
        <div class="WindowTitleButtons">
          <Show when={!p.window.parentId && p.window.showInTaskbar}>
            <button
              type="button"
              class="Button WindowTitleButton"
              onClick={() =>
                windowManager.setWindowMinimized(p.window.id, true)
              }
            ></button>
            <button
              type="button"
              class="Button WindowTitleButton"
              onClick={handleMaximize}
            ></button>
          </Show>
          <button
            type="button"
            class="Button WindowTitleButton"
            onClick={() => windowManager.closeWindow(p.window.id)}
          ></button>
        </div>
      </div>
      <div class="WindowContent SmallSpacing">
        {p.window.url}
        <div class="Horizontal SmallSpacing">
          <button
            type="button"
            class="Button WindowTitleButton"
            onClick={() => windowManager.setWindowTitle(p.window.id, 'Test')}
          >
            Set Title
          </button>
          <button
            type="button"
            class="Button WindowTitleButton"
            onClick={() =>
              windowManager.addWindow({
                showInTaskbar: false,
                title: 'Inner Window',
                url: 'file://InnerWindow',
                active: true,
                parentId: p.window.id,
              })
            }
          >
            Add Sub Window
          </button>
        </div>
      </div>
      <div class="WindowResize"></div>
    </section>
  );
}
