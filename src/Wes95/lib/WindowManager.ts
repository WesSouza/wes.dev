import { createUniqueId, type Accessor, type JSX } from 'solid-js';
import { createStore, produce, type SetStoreFunction } from 'solid-js/store';
import { z, ZodType } from 'zod';
import type { Point, Rect, Size } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import { registerBluesky } from '../programs/Bluesky/registry';
import { registerCalculator } from '../programs/Calculator/registry';
import { registerDiskDefragmenter } from '../programs/DiskDefragmenter/registry';
import { registerFileExplorer } from '../programs/FileExplorer/registry';
import { registerMediaPlayer } from '../programs/MediaPlayer/registry';
import { registerQuickView } from '../programs/QuickView/registry';
import { registerWordPad } from '../programs/WordPad/registry';
import { registerFileSystem } from '../system/FileSystem/registry';
import {
  MessageDialogEventSchema,
  registerMessage,
  type MessageDialogEvent,
} from '../system/Message/registry';
import {
  createWindowURL,
  handleActiveWindows,
  parseWindowURL,
} from '../utils/Windows';
import { modifyById, modifyByIds } from '../utils/array';
import { clamp } from '../utils/size';
import { ScreenManager } from './ScreenManager';
import { registerFind } from '../programs/Find/registry';

let shared: WindowManager | undefined;

const NextWindowPositionOffset = 32;
const MinVisibleLeft = 6 + 4 + 32 + 4 + 32;
const MinVisibleRight = 34 + 34 + 4 + 34 + 6 + 4 + 34;
const MinVisibleTop = 6;
const MinVisibleBottom = 42;
const TitleHeight = 18;
const TitleAnimationDelay = 350;

const DefaultMinSize = {
  width: 320,
  height: 240,
};

type TitleAnimationLocation = 'maximized' | 'minimized' | 'restored';

export type WindowLibrary = {
  [k: string]: ProgramRegistry;
};

export type ProgramRegistry = {
  name: string;
  windows: {
    [k: string]: {
      async?: boolean;
      schema: z.AnyZodObject;
      window:
        | ((p: { data: any; window: WindowState }) => JSX.Element)
        | (() => Promise<{
            default: (p: { data: any; window: WindowState }) => JSX.Element;
          }>);
      files?: {
        match: RegExp;
        param: string;
      }[];
      urls?: {
        match: RegExp;
        params?: (matches: Record<string, string>) => Record<string, any>;
      }[];
    };
  };
};

export type WindowInit = Partial<
  Pick<
    WindowState,
    | 'centerToParent'
    | 'centerToScreen'
    | 'icon'
    | 'maximized'
    | 'minimized'
    | 'parentId'
    | 'title'
  >
> & {
  active?: boolean | undefined;
  position?: Point | undefined;
  size?: Partial<Size> | undefined;
};

export type WindowManagerState = {
  activeTaskWindow: string | null;
  activeTaskWindowHistory: string[];
  activeWindow: string | null;
  activeWindowHistory: string[];
  lastWindowPosition: Point;
  movingWindows: boolean;
  titleAnimation:
    | {
        title: string;
        icon?: string;
        from: Rect;
        to: Rect;
      }
    | undefined;
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
    Bluesky: registerBluesky(),
    Calculator: registerCalculator(),
    DiskDefragmenter: registerDiskDefragmenter(),
    FileExplorer: registerFileExplorer(),
    FileSystem: registerFileSystem(),
    Find: registerFind(),
    QuickView: registerQuickView(),
    MediaPlayer: registerMediaPlayer(),
    Message: registerMessage(),
    WordPad: registerWordPad(),
  };

  desktopSize: Accessor<Size | undefined>;
  state: WindowManagerState;
  #setState: SetStoreFunction<WindowManagerState>;
  #titleAnimationStateTimer: number | undefined;
  #titleAnimationTitleTimer: number | undefined;
  #windowInits = new Map<string, WindowInit>();

  constructor() {
    const [state, setState] = createStore<WindowManagerState>({
      activeTaskWindow: null,
      activeTaskWindowHistory: [],
      activeWindow: null,
      activeWindowHistory: [],
      lastWindowPosition: { x: 0, y: 0 },
      movingWindows: false,
      titleAnimation: undefined,
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
    windowInit: WindowInit = {},
  ): WindowState | undefined => {
    const id = createUniqueId();
    let parentId = windowInit.parentId;
    let parentWindow = this.getWindow(parentId);
    while (parentWindow?.parentId) {
      parentId = parentWindow?.parentId;
      parentWindow = this.getWindow(parentId);
    }

    this.#windowInits.set(id, windowInit);

    const [WindowContentComponent, WindowDataSchema] = parseWindowURL(
      url,
      this.windowLibrary,
    );

    if (!WindowContentComponent) {
      this.messageDialog({
        message: 'Application not found.',
        title: 'Error',
        type: 'error',
        onAction: () => {},
      });
      console.error(`[Window] Missing window for URL `, url);
      return;
    }

    const window: WindowState = {
      dataSchema: WindowDataSchema,
      height: 0,
      id,
      initialized: false,
      parentId,
      showInTaskbar: false,
      sizeConstraints: {},
      title: '',
      url,
      width: 0,
      x: 0,
      y: 0,
    };

    this.#setState(
      produce((state) => {
        state.windows.push(window);
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

  init = (
    windowId: string,
    options: Partial<
      Pick<
        WindowState,
        | 'centerToParent'
        | 'centerToScreen'
        | 'height'
        | 'icon'
        | 'maximizable'
        | 'minimizable'
        | 'showInTaskbar'
        | 'sizeAutomatic'
        | 'sizeConstraints'
        | 'title'
        | 'width'
      >
    >,
  ) => {
    const { centerToParent, centerToScreen, sizeAutomatic, sizeConstraints } =
      options;
    const { width: defaultWidth, height: defaultHeight } = options;

    const screenBreakpoint = ScreenManager.shared.screenBreakpoint();
    const screenRect = ScreenManager.shared.desktopSize();
    const window = this.getWindow(windowId);
    const windowInit = this.#windowInits.get(windowId);
    if (!window || !windowInit || !screenRect) {
      return;
    }

    let x = windowInit.position?.x;
    let y = windowInit.position?.y;

    if (x === undefined || y === undefined) {
      this.#setState('lastWindowPosition', (previous) => {
        const next = {
          x: previous.x + NextWindowPositionOffset,
          y: previous.y + NextWindowPositionOffset,
        };
        if (next.x > screenRect.width / 2 || next.y > screenRect.height / 2) {
          return {
            x: NextWindowPositionOffset,
            y: NextWindowPositionOffset,
          };
        }
        return {
          x: next.x,
          y: next.y,
        };
      });

      x = this.state.lastWindowPosition.x;
      y = this.state.lastWindowPosition.y;
    }

    const width = Math.min(
      windowInit.size?.width ?? defaultWidth ?? DefaultMinSize.width,
      screenRect.width,
    );
    const height = Math.min(
      windowInit.size?.height ?? defaultHeight ?? DefaultMinSize.height,
      screenRect.height,
    );

    if (windowInit.centerToParent ?? centerToParent) {
      const parentRect = this.getEffectiveWindowRect(window.parentId);
      if (parentRect) {
        x = parentRect.x + parentRect.width / 2 - width / 2;
        y = parentRect.y + parentRect.height / 2 - height / 2;
      }
    } else if (windowInit.centerToScreen ?? centerToScreen) {
      if (screenRect) {
        x = screenRect.width / 2 - width / 2;
        y = screenRect.height / 2 - height / 2;
      }
    }

    x = Math.min(Math.max(x, 0), screenRect.width - MinVisibleLeft);
    y = Math.min(Math.max(y, 0), screenRect.height - MinVisibleBottom);

    const showInTaskbar =
      options.showInTaskbar ?? window.parentId === undefined;

    this.setWindow(windowId, (window) => {
      window.initialized = true;

      window.centerToParent = centerToParent;
      window.centerToScreen = centerToScreen;
      window.height = height;
      window.icon = options.icon;
      window.maximizable = options.maximizable ?? showInTaskbar;
      window.maximized =
        window.maximizable && screenBreakpoint === 'small'
          ? true
          : windowInit.maximized;
      window.minimizable = options.minimizable ?? showInTaskbar;
      window.minimized = windowInit.minimized;
      window.showInTaskbar = showInTaskbar;
      window.sizeAutomatic = sizeAutomatic;
      window.sizeConstraints.max = sizeConstraints?.max;
      window.sizeConstraints.min = sizeConstraints?.min ?? DefaultMinSize;
      window.title = options.title ?? 'Untitled';
      window.width = width;
      window.x = x;
      window.y = y;
    });

    this.#setState(
      produce((state) => {
        handleActiveWindows(
          windowInit.active ? window : undefined,
          this.getWindow(window.parentId),
          state,
        );
      }),
    );

    this.#windowInits.delete(windowId);
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

  replaceWindow = (windowId: string, url: string) => {
    this.#setState(
      produce((state) => {
        modifyById(windowId, state.windows, (window) => {
          window.url = url;
        });
      }),
    );
  };

  setActiveWindow = (windowItem: WindowState | undefined) => {
    this.#setState(
      produce((state) => {
        if (!windowItem) {
          state.activeTaskWindow = null;
          state.activeWindow = null;
          handleActiveWindows(undefined, undefined, state);
        } else {
          handleActiveWindows(
            windowItem,
            this.getWindow(windowItem.parentId),
            state,
          );
        }
      }),
    );

    if (!windowItem) {
      return;
    }

    const minimizedWindows = this.state.windows.some(
      ({ id, minimized, parentId }) =>
        (id === windowItem.id || parentId === windowItem.id) && minimized,
    );

    if (!minimizedWindows) {
      return;
    }

    this.animateTitle(
      windowItem.id,
      'minimized',
      windowItem.maximized ? 'maximized' : 'restored',
    );

    window.clearTimeout(this.#titleAnimationStateTimer);
    this.#titleAnimationStateTimer = window.setTimeout(() => {
      this.#setState(
        produce((state) => {
          const windowIdsToRestore = [windowItem.id].concat(
            state.windows
              .filter(({ parentId }) => parentId === windowItem.id)
              .map((window) => window.id),
          );

          modifyByIds(windowIdsToRestore, state.windows, (window) => {
            window.minimized = false;
          });
          handleActiveWindows(
            windowItem,
            this.getWindow(windowItem.parentId),
            state,
          );
        }),
      );
    }, TitleAnimationDelay);
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
    const windowItem = this.getWindow(windowId);
    if (windowItem?.maximized !== maximized) {
      this.animateTitle(
        windowId,
        maximized ? 'restored' : 'maximized',
        maximized ? 'maximized' : 'restored',
      );
    }

    window.clearTimeout(this.#titleAnimationStateTimer);
    this.#titleAnimationStateTimer = window.setTimeout(() => {
      this.#setState(
        produce((state) => {
          modifyById(windowId, state.windows, (window) => {
            window.maximized = maximized;
          });
        }),
      );
    }, TitleAnimationDelay);
  };

  setWindowMinimized = (windowId: string, minimized: boolean) => {
    const windowItem = this.getWindow(windowId);
    if (windowItem?.minimized !== minimized) {
      this.animateTitle(
        windowId,
        minimized
          ? windowItem?.maximized
            ? 'maximized'
            : 'restored'
          : 'minimized',
        minimized
          ? 'minimized'
          : windowItem?.maximized
            ? 'maximized'
            : 'restored',
      );
    }

    this.#setState(
      produce((state) => {
        state.activeTaskWindow = null;
        state.activeWindow = null;
      }),
    );

    window.clearTimeout(this.#titleAnimationStateTimer);
    this.#titleAnimationStateTimer = window.setTimeout(() => {
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
    }, TitleAnimationDelay);
  };

  setWindowPosition = (windowId: string, position: Point) => {
    const desktopSize = this.desktopSize();
    const window = this.getWindow(windowId);
    if (!desktopSize || !window) {
      return;
    }

    const minX = MinVisibleRight - window.width;
    const minY = -MinVisibleTop;
    const maxX = desktopSize.width - MinVisibleLeft;
    const maxY = desktopSize.height - MinVisibleBottom;

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

  setWindowSize = (
    windowId: string,
    size: Size,
    anchorToXEdge = false,
    anchorToYEdge = false,
  ) => {
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

    if (anchorToXEdge) {
      x = window.x + window.width - width;
    }

    if (anchorToYEdge) {
      y = window.y + window.height - height;
    }

    if (y < -MinVisibleTop) {
      height += MinVisibleTop + y;
      y = -MinVisibleTop;
    }

    if (x > desktopSize.width - MinVisibleLeft) {
      width -= desktopSize.width - MinVisibleLeft - x;
      x = desktopSize.width - MinVisibleLeft;
    }

    if (y > desktopSize.height - MinVisibleBottom) {
      height -= desktopSize.height - MinVisibleBottom - y;
      y = desktopSize.height - MinVisibleBottom;
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

  // MARK: Animation

  animateTitle = (
    windowId: string,
    from: TitleAnimationLocation,
    to: TitleAnimationLocation,
  ) => {
    const windowItem = this.getWindow(windowId);
    if (!windowItem) {
      return;
    }

    const fromRect = this.getTitleRect(windowItem, from);
    const toRect = this.getTitleRect(windowItem, to);

    if (from && to) {
      this.#setState('titleAnimation', {
        title: windowItem.title,
        icon: windowItem.icon,
        from: fromRect,
        to: toRect,
      });
      window.clearTimeout(this.#titleAnimationTitleTimer);
      this.#titleAnimationTitleTimer = window.setTimeout(() => {
        this.#setState('titleAnimation', undefined);
      }, TitleAnimationDelay);
    }
  };

  getTitleRect = (
    window: WindowState,
    location: TitleAnimationLocation,
  ): Rect | undefined => {
    const scale = ScreenManager.shared.scale();
    const screen = ScreenManager.shared.desktopSize();
    if (!screen) {
      return;
    }

    switch (location) {
      case 'maximized': {
        return {
          x: 0,
          y: 0,
          width: screen.width,
          height: TitleHeight * scale,
        };
      }

      case 'minimized': {
        const element = document.querySelector(
          `[data-window-taskbar-button="${window.id}"]`,
        );
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        return {
          x: rect.x + scale * 3,
          y: rect.y + scale * 3,
          width: rect.width - scale * 6,
          height: rect.height - scale * 6,
        };
      }

      case 'restored': {
        return {
          x: window.x + scale * 3,
          y: window.y + scale * 3,
          width: window.width - scale * 6,
          height: TitleHeight * scale,
        };
      }
    }
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
    onAction?: (event: MessageDialogEvent) => void;
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
        parentId: options.parentId,
      },
    );

    this.handleOnce(
      delegateId,
      (event) => {
        options.onAction?.(event);
        this.closeWindow(messageWindow?.id);
      },
      MessageDialogEventSchema,
    );

    return messageWindow;
  };

  // MARK: Utils

  matchPath = (path: string) => {
    for (const [appName, registry] of Object.entries(this.windowLibrary)) {
      for (const [windowName, window] of Object.entries(registry.windows)) {
        if (!window.files) {
          continue;
        }

        for (const fileMatch of window.files) {
          const matches = path.match(fileMatch.match);
          if (!matches) {
            continue;
          }

          return createWindowURL(`app://${appName}/${windowName}`, {
            [fileMatch.param]: path,
          });
        }
      }
    }

    return undefined;
  };

  matchURL = (url: string) => {
    for (const [appName, registry] of Object.entries(this.windowLibrary)) {
      for (const [windowName, window] of Object.entries(registry.windows)) {
        if (!window.urls) {
          continue;
        }

        for (const urlMatch of window.urls) {
          const matches = url.match(urlMatch.match);
          if (!matches) {
            continue;
          }

          let params = matches.groups ?? {};

          if (urlMatch.params) {
            params = urlMatch.params(params);
          }

          return createWindowURL(`app://${appName}/${windowName}`, params);
        }
      }
    }

    return undefined;
  };
}
