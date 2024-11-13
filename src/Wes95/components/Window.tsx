import type { JSX } from 'solid-js/jsx-runtime';
import type { WindowManager } from '../lib/WindowManager';
import type { Point } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';

export function Window(p: {
  active: boolean;
  window: WindowState;
  windowManager: WindowManager;
  zIndex?: number | undefined;
}) {
  const { windowManager } = p;

  let clickOffset: Point | undefined;
  let windowRef!: HTMLElement;

  const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (
    event,
  ) => {
    event.preventDefault();

    document.documentElement.style.setProperty('overflow', 'hidden');
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
    document.documentElement.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    event.preventDefault();
    const position = {
      x: event.clientX - clickOffset!.x,
      y: event.clientY - clickOffset!.y,
    };
    windowManager.setWindowPosition(p.window.id, position);
  };

  const handlePointerUp = () => {
    document.documentElement.removeEventListener(
      'pointermove',
      handlePointerMove,
    );
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overscroll-behavior');
    document.documentElement.style.removeProperty('touch-action');
  };

  return (
    <section
      classList={{
        Window: true,
        '-active': p.active,
      }}
      ref={windowRef}
      onPointerDown={() => windowManager.setActiveWindow(p.window)}
      style={{
        position: 'absolute',
        top: `${p.window.rect.y}px`,
        left: `${p.window.rect.x}px`,
        width: `${p.window.rect.width}px`,
        height: `${p.window.rect.height}px`,
        'z-index': p.zIndex,
      }}
    >
      <div class="WindowTitleBar">
        <div class="WindowTitleIcon"></div>
        <div class="WindowTitleText" onPointerDown={handlePointerDown}>
          {p.window.title}
        </div>
        <div class="WindowTitleButtons">
          <button type="button" class="Button WindowTitleButton"></button>
          <button type="button" class="Button WindowTitleButton"></button>
          <button type="button" class="Button WindowTitleButton"></button>
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
