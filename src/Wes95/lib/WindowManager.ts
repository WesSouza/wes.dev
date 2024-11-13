import { createUniqueId } from 'solid-js';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
import type { Point, Size } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { handleActiveWindows } from '../utils/Windows';

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
      'parentId' | 'sizeConstraints' | 'showInTaskbar' | 'title' | 'url'
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
        handleActiveWindows(window, this.getWindow(window.parentId), state);
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
