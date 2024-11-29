import { createUniqueId, type Accessor, type JSX } from 'solid-js';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
import { z, ZodType } from 'zod';
import type { Point, Size } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import {
  BlueskyProfileDataSchema,
  BlueskyProfileWindow,
} from '../programs/Bluesky/ProfileWindow';
import {
  CalculatorMainDataSchema,
  CalculatorMainWindow,
} from '../programs/Caclulator/MainWindow';
import { DiskDefragmenterMainWindow } from '../programs/DiskDefragmenter/MainWindow';
import {
  MediaPlayerMainDataSchema,
  MediaPlayerMainWindow,
} from '../programs/MediaPlayer/MainWindow';
import {
  NotepadMainDataSchema,
  NotepadMainWindow,
} from '../programs/Notepad/MainWindow';
import {
  WordPadMainDataSchema,
  WordPadMainWindow,
} from '../programs/WordPad/MainWindow';
import {
  FileSystemOpenPathWindow,
  FSOpenPathDataSchema,
} from '../system/FileSystem/OpenPathWindow';
import {
  FileSystemOpenWindow,
  FSOpenDataSchema,
} from '../system/FileSystem/OpenWindow';
import {
  MessageDialogDataSchema,
  MessageDialogEventSchema,
  MessageDialogWindow,
  type MessageDialogEvent,
} from '../system/Message/MessageDialogWindow';
import {
  createWindowURL,
  handleActiveWindows,
  parseWindowURL,
} from '../utils/Windows';
import { modifyById, modifyByIds } from '../utils/array';
import { clamp } from '../utils/size';
import { ScreenManager } from './ScreenManager';

let shared: WindowManager | undefined;

const NextWindowPositionOffset = 32;
const MinVisibleLeft = 6 + 4 + 32 + 4 + 32;
const MinVisibleRight = 34 + 34 + 4 + 34 + 6 + 4 + 34;
const MinVisibleHeight = 21;

const DefaultMinSize = {
  width: 320,
  height: 240,
};

export type WindowLibrary = {
  [k: string]: {
    [k: string]: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: { data: any; window: WindowState }) => JSX.Element,
      z.AnyZodObject,
    ];
  };
};

export type WindowManagerState = {
  activeTaskWindow: string | null;
  activeTaskWindowHistory: string[];
  activeWindow: string | null;
  activeWindowHistory: string[];
  lastWindowPosition: Point;
  movingWindows: boolean;
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

  windowLibrary: WindowLibrary = {
    Bluesky: {
      Profile: [BlueskyProfileWindow, BlueskyProfileDataSchema],
    },
    DiskDefragmenter: {
      Main: [DiskDefragmenterMainWindow, z.object({})],
    },
    Calculator: {
      Main: [CalculatorMainWindow, CalculatorMainDataSchema],
    },
    MediaPlayer: {
      Main: [MediaPlayerMainWindow, MediaPlayerMainDataSchema],
    },
    Message: {
      MessageDialog: [MessageDialogWindow, MessageDialogDataSchema],
    },
    Notepad: {
      Main: [NotepadMainWindow, NotepadMainDataSchema],
    },
    FileSystem: {
      Open: [FileSystemOpenWindow, FSOpenDataSchema],
      OpenPath: [FileSystemOpenPathWindow, FSOpenPathDataSchema],
    },
    WordPad: {
      Main: [WordPadMainWindow, WordPadMainDataSchema],
    },
  };

  desktopSize: Accessor<Size | undefined>;
  state: WindowManagerState;
  #setState: SetStoreFunction<WindowManagerState>;

  constructor() {
    const [state, setState] = createStore<WindowManagerState>({
      activeTaskWindow: null,
      activeTaskWindowHistory: [],
      activeWindow: null,
      activeWindowHistory: [],
      lastWindowPosition: { x: 0, y: 0 },
      movingWindows: false,
      windows: [],
      windowZIndexMap: new Map(),
    });

    this.desktopSize = ScreenManager.shared.desktopSize;
    this.state = state;
    this.#setState = setState;
  }

  // MARK: Window

  addWindow = (
    url: string,
    windowInit: Partial<
      Pick<
        WindowState,
        | 'centerToParent'
        | 'centerToScreen'
        | 'icon'
        | 'maximized'
        | 'maximizable'
        | 'minimized'
        | 'minimizable'
        | 'parentId'
        | 'sizeAutomatic'
        | 'sizeConstraints'
        | 'showInTaskbar'
        | 'title'
      >
    > & {
      active?: boolean | undefined;
      position?: Point | undefined;
      size?: Partial<Size> | undefined;
    } = {},
  ): WindowState | undefined => {
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
      ...DefaultMinSize,
      ...windowInit.size,
      ...initialPosition,
    };

    const showInTaskbar = windowInit.showInTaskbar ?? parentId === undefined;

    const [WindowContentComponent, WindowDataSchema] = parseWindowURL(
      url,
      this.windowLibrary,
    );

    if (!WindowContentComponent) {
      console.error(`[Window] Missing window for URL `, url);
      return;
    }

    const window: WindowState = {
      ...rect,
      centerToParent: windowInit.centerToParent,
      centerToScreen: windowInit.centerToScreen,
      dataSchema: WindowDataSchema,
      id,
      parentId,
      icon: windowInit.icon,
      title: windowInit.title ?? '',
      maximized: windowInit.maximized,
      maximizable: windowInit.maximizable ?? showInTaskbar,
      minimized: windowInit.minimized,
      minimizable: windowInit.minimizable ?? showInTaskbar,
      url,
      showInTaskbar,
      sizeAutomatic: windowInit.sizeAutomatic,
      sizeConstraints: {
        min: windowInit.sizeConstraints?.min ?? DefaultMinSize,
        max: windowInit.sizeConstraints?.max,
      },
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

  closeWindow = (windowId: string | undefined) => {
    if (!windowId) {
      return;
    }

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

  getEffectiveWindowRect = (windowId: string | undefined) => {
    const window = this.getWindow(windowId);

    if (window && !window.maximized) {
      return {
        x: window.x,
        y: window.y,
        width: window.width,
        height: window.height,
      };
    } else {
      const desktopSize = ScreenManager.shared.desktopSize();
      if (desktopSize) {
        return {
          x: 0,
          y: 0,
          width: desktopSize.width,
          height: desktopSize.height,
        };
      }
    }

    return;
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

  place = (
    windowId: string,
    options: Partial<
      Pick<
        WindowState,
        | 'centerToParent'
        | 'centerToScreen'
        | 'height'
        | 'sizeAutomatic'
        | 'sizeConstraints'
        | 'width'
        | 'x'
        | 'y'
      >
    >,
  ) => {
    const { centerToParent, centerToScreen, sizeAutomatic, sizeConstraints } =
      options;
    let { x, y, width, height } = options;

    const window = this.getWindow(windowId);
    const windowRect = this.getEffectiveWindowRect(windowId);
    if (!window || !windowRect) {
      return;
    }

    x ??= windowRect.x;
    y ??= windowRect.y;
    width ??= windowRect.width;
    height ??= windowRect.height;

    const screenRect = ScreenManager.shared.desktopSize();

    if (screenRect) {
      width = Math.min(width, screenRect.width);
      height = Math.min(height, screenRect.height);
    }

    if (centerToParent ?? window.centerToParent) {
      const parentRect = this.getEffectiveWindowRect(window.parentId);
      if (parentRect) {
        x = parentRect.x + parentRect.width / 2 - width / 2;
        y = parentRect.y + parentRect.height / 2 - height / 2;
      }
    } else if (centerToScreen ?? window.centerToScreen) {
      if (screenRect) {
        x = screenRect.width / 2 - width / 2;
        y = screenRect.height / 2 - height / 2;
      }
    }

    x = Math.max(x, 0);
    y = Math.max(y, 0);

    if (screenRect) {
      x = Math.min(x, screenRect.width - MinVisibleLeft);
      y = Math.min(y, screenRect.height - MinVisibleHeight);
    }

    this.setWindow(windowId, (window) => {
      window.x = x;
      window.y = y;
      window.width = width;
      window.height = height;

      if (centerToParent !== undefined) {
        window.centerToParent = centerToParent;
      }
      if (centerToScreen !== undefined) {
        window.centerToScreen = centerToScreen;
      }
      if (sizeAutomatic !== undefined) {
        window.sizeAutomatic = sizeAutomatic;
      }
      if (sizeConstraints?.max !== undefined) {
        window.sizeConstraints.max = sizeConstraints.max;
      }
      if (sizeConstraints?.min !== undefined) {
        window.sizeConstraints.min = sizeConstraints.min;
      }
    });
  };

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

  setMovingWindows = (movingWindows: boolean) => {
    this.#setState('movingWindows', movingWindows);
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
    const desktopSize = this.desktopSize();
    const window = this.getWindow(windowId);
    if (!desktopSize || !window) {
      return;
    }

    const minX = MinVisibleRight - window.width;
    const minY = -MinVisibleHeight;
    const maxX = desktopSize.width - MinVisibleLeft;
    const maxY = desktopSize.height - MinVisibleHeight;

    position.x = clamp(minX, position.x, maxX);
    position.y = clamp(minY, position.y, maxY);

    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.x = position.x;
          window.y = position.y;
        });
      }),
    );
  };

  setWindowSize = (windowId: string, size: Size, anchorToEdge = false) => {
    const desktopSize = this.desktopSize();
    const window = this.getWindow(windowId);
    if (!desktopSize || !window) {
      return;
    }

    let x = window.x;
    let y = window.y;
    let width = clamp(
      window.sizeConstraints?.min?.width,
      size.width,
      window.sizeConstraints?.max?.width,
    );
    let height = clamp(
      window.sizeConstraints?.min?.height,
      size.height,
      window.sizeConstraints?.max?.height,
    );

    if (anchorToEdge) {
      x = window.x + window.width - width;
      y = window.y + window.height - height;
    }

    if (x < 0) {
      width += x;
      x = 0;
    }

    if (y < 0) {
      height += y;
      y = 0;
    }

    const overflowX = x + width - desktopSize.width;
    const overflowY = y + height - desktopSize.height;
    if (overflowX > 0) {
      width -= overflowX;
    }
    if (overflowY > 0) {
      height -= overflowY;
    }

    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.x = x;
          window.y = y;
          window.width = width;
          window.height = height;
        });
      }),
    );
  };

  setWindow = (windowId: string, modifyFn: (item: WindowState) => void) => {
    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, modifyFn);
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

  // MARK: Dialogs

  messageDialog = (options: {
    message: string;
    onAction: (event: MessageDialogEvent) => void;
    parentId?: string;
    title: string;
    type: 'error' | 'info' | 'question' | 'warning';
  }) => {
    const delegateId = createUniqueId();
    const messageWindow = this.addWindow(
      createWindowURL('system://Message/MessageDialog', {
        delegateId,
        title: options.title,
        type: options.type,
        message: options.message,
      }),
      {
        active: true,
        centerToParent: true,
        maximizable: false,
        minimizable: false,
        parentId: options.parentId,
        sizeAutomatic: true,
      },
    );

    this.handleOnce(
      delegateId,
      (event) => {
        options.onAction(event);
        this.closeWindow(messageWindow?.id);
      },
      MessageDialogEventSchema,
    );

    return messageWindow;
  };
}
