import type { WindowManager } from '../lib/WindowManager';
import type { WindowState } from '../models/WindowState';

export function Window(props: {
  active: boolean;
  window: WindowState;
  windowManager: WindowManager;
  zIndex?: number | undefined;
}) {
  return (
    <section
      classList={{
        Window: true,
        '-active': props.active,
      }}
      style={{
        position: 'absolute',
        top: `${props.window.rect.y}px`,
        left: `${props.window.rect.x}px`,
        width: `${props.window.rect.width}px`,
        height: `${props.window.rect.height}px`,
        'z-index': props.zIndex,
      }}
    >
      <div
        class="WindowTitleBar"
        onClick={() => props.windowManager.setActiveWindow(props.window)}
      >
        <div class="WindowTitleIcon"></div>
        <div class="WindowTitleText">{props.window.title}</div>
        <div class="WindowTitleButtons">
          <button type="button" class="Button WindowTitleButton"></button>
          <button type="button" class="Button WindowTitleButton"></button>
          <button type="button" class="Button WindowTitleButton"></button>
        </div>
      </div>
      <div class="WindowContent SmallSpacing">
        {props.window.url}
        <div class="Horizontal SmallSpacing">
          <button
            type="button"
            class="Button WindowTitleButton"
            onClick={() =>
              props.windowManager.setWindowTitle(props.window.id, 'Test')
            }
          >
            Set Title
          </button>
          <button
            type="button"
            class="Button WindowTitleButton"
            onClick={() =>
              props.windowManager.addWindow({
                showInTaskbar: false,
                title: 'Inner Window',
                url: 'file://InnerWindow',
                active: true,
                parentId: props.window.id,
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
