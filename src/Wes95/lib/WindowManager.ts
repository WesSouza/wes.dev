import { createUniqueId, type JSX } from 'solid-js';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
import type { z, ZodType } from 'zod';
import type { Point, Rect, Size } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { NotepadEditorWindow } from '../programs/Notepad/EditorWindow';
import { handleActiveWindows } from '../utils/Windows';
import { modifyById, modifyByIds } from '../utils/array';
import { FileSystemOpenWindow } from '../system/FileSystem/OpenWindow';
import { WriteEditorWindow } from '../programs/Write/EditorWindow';

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

  windowLibrary: {
    [k: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [k: string]: (p: { data: any; window: WindowState }) => JSX.Element;
    };
  } = {
    Notepad: {
      Editor: NotepadEditorWindow,
    },
    FileSystem: {
      Open: FileSystemOpenWindow,
    },
    Write: {
      Editor: WriteEditorWindow,
    },
  };

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

  // MARK: Window

  addWindow = (
    schema: z.AnyZodObject,
    url: string,
    windowInit: Partial<
      Pick<
        WindowState,
        | 'icon'
        | 'maximized'
        | 'minimized'
        | 'parentId'
        | 'sizeConstraints'
        | 'showInTaskbar'
        | 'title'
      >
    > & {
      active?: boolean | undefined;
      position?: Point | undefined;
      size?: Size | undefined;
    } = {},
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
      dataSchema: schema,
      id,
      parentId,
      rect,
      icon: windowInit.icon,
      title: windowInit.title ?? '',
      maximized: windowInit.maximized,
      minimized: windowInit.minimized,
      url,
      showInTaskbar: windowInit.showInTaskbar ?? parentId === undefined,
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

  isAnyWindowMaximized = () => {
    return this.state.windows.some((window) => window.maximized);
  };

  isWindowActive = (windowId: string) => {
    return this.state.activeWindow === windowId;
  };

  isWindowInTaskbar = (window: WindowState) => {
    return window.showInTaskbar && !window.parentId;
  };

  // MARK: Editing

  setActiveWindow = (window: WindowState | undefined) => {
    this.#setState(
      produce((state) => {
        if (!window) {
          state.activeTaskWindow = null;
          state.activeWindow = null;
          handleActiveWindows(undefined, undefined, state);
          return;
        }

        const windowIdsToRestore = [window.id].concat(
          state.windows
            .filter(({ parentId }) => parentId === window.id)
            .map((window) => window.id),
        );

        modifyByIds(windowIdsToRestore, state.windows, (window) => {
          window.minimized = false;
        });
        handleActiveWindows(window, this.getWindow(window.parentId), state);
      }),
    );
  };

  setWindowIcon = (windowId: string, icon: string) => {
    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.icon = icon;
        });
      }),
    );
  };

  setWindowMaximized = (windowId: string, maximized: boolean) => {
    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.maximized = maximized;
        });
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

        modifyByIds(windowIdsToMinimize, state.windows, (window) => {
          window.minimized = minimized;
        });

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
    const window = this.getWindow(windowId);
    if (!window) {
      return;
    }

    if (position.x < 0) {
      position.x = 0;
    }

    if (position.y < 0) {
      position.y = 0;
    }

    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.rect.x = position.x;
          window.rect.y = position.y;
        });
      }),
    );
  };

  setWindowPositionAndSize = (windowId: string, positionAndSize: Rect) => {
    const window = this.getWindow(windowId);
    if (!window) {
      return;
    }

    if (
      positionAndSize.x < 0 ||
      (window.sizeConstraints?.min?.width &&
        positionAndSize.width < window.sizeConstraints?.min?.width) ||
      (window.sizeConstraints?.max?.width &&
        positionAndSize.width > window.sizeConstraints?.max?.width)
    ) {
      positionAndSize.width = window.rect.width;
      positionAndSize.x = window.rect.x;
    }

    if (
      positionAndSize.y < 0 ||
      (window.sizeConstraints?.min?.height &&
        positionAndSize.height < window.sizeConstraints?.min?.height) ||
      (window.sizeConstraints?.max?.height &&
        positionAndSize.height > window.sizeConstraints?.max?.height)
    ) {
      positionAndSize.height = window.rect.height;
      positionAndSize.y = window.rect.y;
    }

    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.rect = positionAndSize;
        });
      }),
    );
  };

  setWindowTitle = (windowId: string, title: string) => {
    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.title = title;
        });
      }),
    );
  };

  // MARK: Events

  handlers = new Map<string, Map<(event: unknown) => void, ZodType>>();

  addHandler = <T extends z.ZodTypeAny>(
    delegateId: string,
    handler: (event: z.infer<T>) => void,
    schema: T,
  ) => {
    let handlers = this.handlers.get(delegateId);
    if (!handlers) {
      handlers = new Map();
      this.handlers.set(delegateId, handlers);
    }

    handlers.set(handler, schema);
  };

  handleOnce = <T extends z.ZodTypeAny>(
    delegateId: string,
    handler: (event: z.infer<T>) => void,
    schema: T,
  ) => {
    const handleAndRemove = (event: unknown) => {
      const parsedEvent = schema.safeParse(event);
      if (parsedEvent.success) {
        handler(parsedEvent.data);
        this.removeHandler(delegateId, handleAndRemove);
      }
    };
    this.addHandler(delegateId, handleAndRemove, schema);
  };

  removeHandler = (delegateId: string, handler: (event: unknown) => void) => {
    let handlers = this.handlers.get(delegateId);
    if (!handlers) {
      handlers = new Map();
      this.handlers.set(delegateId, handlers);
    }

    handlers.delete(handler);
  };

  delegate = (delegateId: string, event: unknown) => {
    const handlers = this.handlers.get(delegateId);
    if (!handlers) {
      return;
    }

    for (const [handler, schema] of handlers) {
      const parsedEvent = schema.safeParse(event);
      if (parsedEvent.success) {
        handler(parsedEvent.data);
      }
    }
  };
}
