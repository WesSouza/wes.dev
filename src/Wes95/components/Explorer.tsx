import { For, Show, type JSX } from 'solid-js';
import { WindowManager } from '../lib/WindowManager';
import { Window } from './Window';
import { Icon } from './Icon';

let i = 1;

export const Explorer = () => {
  const windowManager = WindowManager.shared;
  const state = windowManager.state;

  const addWindow = () => {
    windowManager.addWindow({
      icon: 'iconWes',
      title: 'Window ' + i++,
      url: `file://Window`,
      showInTaskbar: true,
      active: true,
    });
  };

  const handleDesktopTaskbarClick: JSX.EventHandler<HTMLElement, MouseEvent> = (
    event,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    windowManager.setActiveWindow(undefined);
  };

  return (
    <div class="Screen">
      <main class="Desktop" onClick={handleDesktopTaskbarClick}>
        <For each={state.windows}>
          {(window) => (
            <Window
              active={windowManager.isWindowActive(window.id)}
              window={window}
              windowManager={windowManager}
              zIndex={windowManager.getWindowZIndex(window.id)}
            />
          )}
        </For>
      </main>
      <footer class="Taskbar" onClick={handleDesktopTaskbarClick}>
        <button type="button" class="TaskbarButton" onClick={addWindow}>
          <Icon icon="iconWes" />
          Start
        </button>
        <div class="VerticalSeparator" />
        <div class="VerticalHandle" />
        <For each={state.windows.filter((window) => window.showInTaskbar)}>
          {(window) => (
            <button
              classList={{
                TaskbarButton: true,
                '-active': state.activeTaskWindow === window.id,
                '-down': state.activeTaskWindow === window.id,
              }}
              onClick={() => windowManager.setActiveWindow(window)}
            >
              <Show when={window.icon}>
                <Icon icon={window.icon!} />
              </Show>
              {window.title}
            </button>
          )}
        </For>
      </footer>
    </div>
  );
};
