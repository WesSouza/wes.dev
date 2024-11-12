import { createUniqueId } from 'solid-js';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
import type { WindowState } from '../models/WindowState';
import { addActiveWindowToHistory } from '../utils/Windows';

let shared: WindowManager | undefined;

type WindowManagerState = {
  activeTaskWindow: string | null;
  activeWindow: string | null;
  activeTaskWindowHistory: string[];
  windows: WindowState[];
};

export class WindowManager {
  static get shared() {
    if (!shared) {
      shared = new WindowManager();
    }

    return shared;
  }

  state: WindowManagerState;
  #setState: SetStoreFunction<WindowManagerState>;

  constructor() {
    const [state, setState] = createStore<WindowManagerState>({
      activeTaskWindow: null,
      activeTaskWindowHistory: [],
      activeWindow: null,
      windows: [],
    });

    this.state = state;
    this.#setState = setState;
  }

  addWindow = (
    windowInit: Pick<
      WindowState,
      'parentId' | 'showInTaskbar' | 'title' | 'url'
    > & {
      active?: boolean | undefined;
    },
  ): WindowState => {
    const id = createUniqueId();
    let parent;
    let parentId = windowInit.parentId;
    while (parent) {
      parentId = parent.id;
      // FIXME: This still doesn't work
      parent = this.getWindow(parentId);
    }
    const window: WindowState = {
      id,
      parentId,
      title: windowInit.title,
      url: windowInit.url,
      showInTaskbar: windowInit.showInTaskbar,
    };

    this.#setState(
      produce((state) => {
        state.windows.push(window);
        if (windowInit.active) {
          if (window.showInTaskbar) {
            state.activeTaskWindow = id;
            state.activeTaskWindowHistory.unshift(window.id);
          }
          state.activeWindow = id;
        }
      }),
    );

    return window;
  };

  getWindow = (windowId: string | undefined) => {
    return windowId
      ? this.state.windows.find((window) => window.id === windowId)
      : undefined;
  };

  isWindowActive = (windowId: string) => {
    return (
      this.state.activeTaskWindow === windowId ||
      this.state.activeWindow === windowId
    );
  };

  setActiveWindow = (window: WindowState) => {
    this.#setState(
      produce((state) => {
        if (window.showInTaskbar || window.parentId) {
          const activeTaskWindow = this.getWindow(window.parentId) ?? window;
          state.activeTaskWindow = activeTaskWindow.id;
          state.activeTaskWindowHistory = addActiveWindowToHistory(
            activeTaskWindow.id,
            state.activeTaskWindowHistory,
          );
        }
        state.activeWindow = window.id;
      }),
    );
    console.log(this.state);
  };

  setWindowTitle = (windowId: string, title: string) => {
    this.#setState(
      produce((state) => {
        state.windows = state.windows.map((window) =>
          window.id === windowId
            ? {
                ...window,
                title,
              }
            : window,
        );
      }),
    );
  };
}
