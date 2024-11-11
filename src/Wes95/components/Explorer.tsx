import { createStore, produce } from 'solid-js/store';
import { createUniqueId, For } from 'solid-js';
import type { WindowState } from '../models/WindowState';
import { Window } from './Window';

export const Explorer = () => {
  const [state, setState] = createStore<{
    activeWindow: string | null;
    activeTaskWindow: string | null;
    windows: WindowState[];
  }>({
    activeWindow: null,
    activeTaskWindow: null,
    windows: [],
  });

  const addWindow = () => {
    setState(
      produce((state) => {
        const id = createUniqueId();
        state.windows.push({
          id,
          title: 'Window',
          url: `file://Window?id=${id}`,
          showInTaskbar: true,
        });
        state.activeTaskWindow = id;
        state.activeWindow = id;
      }),
    );
  };

  const setActiveWindow = (id: string) => {
    setState(
      produce((state) => {
        state.activeTaskWindow = id;
        state.activeWindow = id;
      }),
    );
  };

  return (
    <div>
      <main>
        <For each={state.windows}>
          {(window) => (
            <Window
              title={window.title}
              active={state.activeWindow === window.id}
              url={window.url}
            />
          )}
        </For>
      </main>
      <footer>
        <button class="Button" onClick={addWindow}>
          Start
        </button>
        <For each={state.windows.filter((window) => window.showInTaskbar)}>
          {(window) => (
            <button
              classList={{
                Button: true,
                '-down': state.activeTaskWindow === window.id,
              }}
              onClick={() => setActiveWindow(window.id)}
            >
              {window.title}
            </button>
          )}
        </For>
      </footer>
    </div>
  );
};
