import { createUniqueId } from 'solid-js';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
import type { Point, Size } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { handleActiveWindows } from '../utils/Windows';
import { modifyById, modifyByIds } from '../utils/array';

let shared: WindowManager | undefined;

const NextWindowPositionOffset = 32;

export type WindowManagerState = {
  activeTaskWindow: string | null;
  activeTaskWindowHistory: string[];
  activeWindow: string | null;
  activeWindowHistory: string[];
  lastWindowPosition: Point;
  windows: WindowState[];
  windowZIndexMap: Map<string, number>;
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
      activeWindowHistory: [],
      lastWindowPosition: { x: 0, y: 0 },
      windows: [],
      windowZIndexMap: new Map(),
    });

    this.state = state;
    this.#setState = setState;
  }

  addWindow = (
    windowInit: Pick<
      WindowState,
      | 'maximized'
      | 'minimized'
      | 'parentId'
      | 'sizeConstraints'
      | 'showInTaskbar'
      | 'title'
      | 'url'
    > & {
      active?: boolean | undefined;
      position?: Point | undefined;
      size?: Size | undefined;
    },
  ): WindowState => {
    const id = createUniqueId();
    let parentId = windowInit.parentId;
    let parentWindow = this.getWindow(parentId);
    while (parentWindow?.parentId) {
      parentId = parentWindow?.parentId;
      parentWindow = this.getWindow(parentId);
    }

    let initialPosition = windowInit.position;
    if (!initialPosition) {
      this.#setState((state) => ({
        ...state,
        lastWindowPosition: {
          x: state.lastWindowPosition.x + NextWindowPositionOffset,
          y: state.lastWindowPosition.y + NextWindowPositionOffset,
        },
      }));

      initialPosition = {
        x: this.state.lastWindowPosition.x,
        y: this.state.lastWindowPosition.y,
      };
    }

    const rect = {
      ...initialPosition,
      width: 300,
      height: 150,
    };

    const window: WindowState = {
      id,
      parentId,
      rect,
      title: windowInit.title,
      maximized: windowInit.maximized,
      minimized: windowInit.minimized,
      url: windowInit.url,
      showInTaskbar: windowInit.showInTaskbar,
    };

    this.#setState(
      produce((state) => {
        state.windows.push(window);
        handleActiveWindows(
          windowInit.active ? window : undefined,
          this.getWindow(window.parentId),
          state,
        );
      }),
    );

    return window;
  };

  closeWindow = (windowId: string) => {
    this.#setState(
      produce((state) => {
        const windowIdsToRemove = [windowId].concat(
          state.windows
            .filter((window) => window.parentId === windowId)
            .map((window) => window.id),
        );
        state.windows = state.windows.filter(
          (window) => !windowIdsToRemove.includes(window.id),
        );
        state.activeTaskWindowHistory = state.activeTaskWindowHistory.filter(
          (activeWindowId) => !windowIdsToRemove.includes(activeWindowId),
        );
        state.activeWindowHistory = state.activeWindowHistory.filter(
          (activeWindowId) => !windowIdsToRemove.includes(activeWindowId),
        );
        handleActiveWindows(undefined, undefined, state);
      }),
    );
  };

  getWindow = (windowId: string | undefined) => {
    return windowId
      ? this.state.windows.find((window) => window.id === windowId)
      : undefined;
  };

  getWindowZIndex = (windowId: string | undefined) => {
    return windowId ? this.state.windowZIndexMap.get(windowId) : undefined;
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
        const windowIdsToRestore = [window.id].concat(
          state.windows
            .filter(({ parentId }) => parentId === window.id)
            .map((window) => window.id),
        );

        state.windows = modifyByIds(
          windowIdsToRestore,
          state.windows,
          (window) => ({
            ...window,
            minimized: false,
          }),
        );
        handleActiveWindows(window, this.getWindow(window.parentId), state);
      }),
    );
  };

  setWindowMaximized = (windowId: string, maximized: boolean) => {
    this.#setState(
      produce((state) => {
        state.windows = modifyById(windowId, state.windows, (window) => ({
          ...window,
          maximized,
        }));
      }),
    );
  };

  setWindowMinimized = (windowId: string, minimized: boolean) => {
    this.#setState(
      produce((state) => {
        const windowIdsToMinimize = [windowId].concat(
          state.windows
            .filter((window) => window.parentId === windowId)
            .map((window) => window.id),
        );

        state.windows = modifyByIds(
          windowIdsToMinimize,
          state.windows,
          (window) => ({
            ...window,
            minimized,
          }),
        );

        if (minimized) {
          if (state.activeTaskWindow === windowId) {
            state.activeTaskWindow = null;
            state.activeWindow = null;
            handleActiveWindows(undefined, undefined, state);
          } else if (state.activeWindow === windowId) {
            state.activeWindow = null;
            handleActiveWindows(undefined, undefined, state);
          }
        }
      }),
    );
  };

  setWindowPosition = (windowId: string, position: Point) => {
    this.#setState(
      produce((state) => {
        state.windows = state.windows.map((window) =>
          window.id === windowId
            ? {
                ...window,
                rect: {
                  ...window.rect,
                  ...position,
                },
              }
            : window,
        );
      }),
    );
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
