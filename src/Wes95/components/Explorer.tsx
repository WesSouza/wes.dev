import { For } from 'solid-js';
import { WindowManager } from '../lib/WindowManager';
import { Window } from './Window';

let i = 1;

export const Explorer = () => {
  const windowManager = WindowManager.shared;
  const state = windowManager.state;

  const addWindow = () => {
    windowManager.addWindow({
      title: 'Window ' + i++,
      url: `file://Window`,
      showInTaskbar: true,
      active: true,
    });
  };

  return (
    <div>
      <main>
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
      <footer>
        <button type="button" class="Button" onClick={addWindow}>
          Start
        </button>
        <For each={state.windows.filter((window) => window.showInTaskbar)}>
          {(window) => (
            <button
              classList={{
                Button: true,
                '-down': state.activeTaskWindow === window.id,
              }}
              onClick={() => windowManager.setActiveWindow(window)}
            >
              {window.title}
            </button>
          )}
        </For>
        <p>Alt+Tab</p>
        <ul>
          <For each={windowManager.state.activeTaskWindowHistory}>
            {(windowId) => <li>{windowManager.getWindow(windowId)?.title}</li>}
          </For>
        </ul>
      </footer>
    </div>
  );
};
