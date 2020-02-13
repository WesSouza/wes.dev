// import uuid from 'uuid/v1';

import { Apps } from '~/constants/Apps';
import { ObjectPosition, ObjectSize } from '~/constants/CommonTypes';
import { Icons } from '~/constants/Icons';
import { Scale } from '~/constants/Styles';
import { StateManager } from '~/utils/StateManager';

import { modalWindowClosed } from './modal';

let i = 1;
function uuid() {
  return String(i++);
}

const NewWindowPositionOffsetSmall: ObjectPosition = {
  x: Scale * 8,
  y: Scale * 8,
};

const NewWindowPositionOffsetLarge: ObjectPosition = {
  x: Scale * 23,
  y: Scale * 23,
};

const SmallScreenMinWidth = 768;

// # Types

export interface Window {
  app: Apps;
  file: string | null;
  id: string;
  meta: WindowMeta | null;
  zIndex: number;
}

export interface WindowMeta {
  icon: Icons | null;
  invisible: boolean;
  maximized: boolean;
  maxSize: ObjectSize | null;
  minimizable: boolean;
  minimized: boolean;
  minSize: ObjectSize | null;
  position: ObjectPosition | null;
  resizable: boolean;
  size: ObjectSize;
  title: string;
}

// # Store

export interface WindowState {
  all: Map<string, Window>;
  allByZIndex: Map<number, Window>;
  desktopFocused: boolean;
  desktopSize: ObjectSize;
  lastPosition: ObjectPosition;
  lastZIndex: number;
  smallScreen: boolean;
}

export const initialWindowState: WindowState = {
  all: new Map<string, Window>(),
  allByZIndex: new Map<number, Window>(),
  desktopFocused: true,
  desktopSize: { width: 0, height: 0 },
  lastPosition: { x: 0, y: 0 },
  lastZIndex: 0,
  smallScreen: false,
};

export const windowStore = new StateManager(initialWindowState);

// # Actions

export function windowClose(id: string) {
  const { all } = windowStore.state;
  const window = all.get(id);
  if (!window) {
    return;
  }

  windowStore.mutate(state => {
    const window = getWindowFromState(state, id);
    const currentZIndex = window.zIndex;
    const { lastZIndex } = state;
    state.all.delete(id);
    state.allByZIndex.delete(currentZIndex);

    if (currentZIndex !== lastZIndex) {
      return;
    }

    state.lastZIndex = windowGetPenultimateZIndexNonMinimizedId(state);
  });

  if (window.app === Apps.modal) {
    modalWindowClosed(window.id);
  }
}

export function windowFocus(id: string | null) {
  if (id === null) {
    windowStore.mutate(state => {
      state.desktopFocused = true;
    });
    return;
  }

  const window = getWindowFromState(windowStore.state, id);
  if (!window) {
    // If you click the close button on the unfocused window, it closes before
    // focusing, so it disappears. It's ok.
    return;
  }

  windowStore.mutate(state => {
    const window = getWindowFromState(state, id);
    const currentZIndex = window.zIndex;
    const nextZIndex = state.lastZIndex + 1;

    window.zIndex = nextZIndex;
    state.allByZIndex.delete(currentZIndex);
    state.allByZIndex.set(nextZIndex, window);
    state.lastZIndex = nextZIndex;

    state.desktopFocused = false;
  });
}

export function windowInit(id: string, meta: WindowMeta) {
  const { all } = windowStore.state;
  const currentWindow = all.get(id);
  if (!currentWindow) {
    throw new Error(`Window ${id} does not exist`);
  }

  let autoPositioned = false;

  if (!meta.position) {
    const { desktopSize, lastPosition, smallScreen } = windowStore.state;
    const positionOffset = smallScreen
      ? NewWindowPositionOffsetSmall
      : NewWindowPositionOffsetLarge;

    const widthDelta = desktopSize.width - meta.size.width;
    const heightDelta = desktopSize.height - meta.size.height;

    if (widthDelta !== 0 && heightDelta !== 0) {
      meta.position = {
        x: (lastPosition.x + positionOffset.x) % widthDelta,
        y: (lastPosition.y + positionOffset.y) % heightDelta,
      };
      autoPositioned = true;
    }
  }

  windowStore.mutate(state => {
    state.all.set(id, {
      ...currentWindow,
      meta,
    });

    if (autoPositioned && meta.position) {
      state.lastPosition = meta.position;
    }
  });
}

export function windowMaximizeRestore(id: string) {
  windowStore.mutate(state => {
    const window = getWindowFromState(state, id);

    if (!window.meta?.resizable) {
      return;
    }

    window.meta.maximized = !window.meta.maximized;
  });
}

export function windowMinimize(id: string) {
  windowStore.mutate(state => {
    const window = getWindowFromState(state, id);

    if (!window.meta?.minimizable) {
      return;
    }

    window.meta.minimized = true;

    state.lastZIndex = windowGetPenultimateZIndexNonMinimizedId(state);
  });
}

export function windowMinimizeRestore(id: string) {
  const window = getWindowFromState(windowStore.state, id);
  const focused = windowGetFocusedId(windowStore.state) === id;

  if (!window.meta?.minimizable) {
    return;
  }

  if (focused) {
    windowMinimize(id);
  } else {
    windowRestore(id);
  }
}

export function windowOpen(app: Apps, file?: string): string {
  const id = uuid();

  windowStore.mutate(state => {
    const zIndex = state.lastZIndex + 1;
    const window: Window = {
      app,
      file: file ?? null,
      id,
      meta: null,
      zIndex,
    };

    state.all.set(id, window);
    state.allByZIndex.set(zIndex, window);

    state.desktopFocused = false;
    state.lastZIndex = zIndex;
  });

  return id;
}

export function windowPositionProportionally(
  id: string,
  positionPercentage: ObjectPosition,
) {
  const { desktopSize } = windowStore.state;
  const window = getWindowFromState(windowStore.state, id);
  if (!window.meta) {
    throw new Error('Unable to position uninitialized window');
  }

  const { size } = window.meta;

  const position = {
    x: Math.floor((desktopSize.width - size.width) * positionPercentage.x),
    y: Math.floor((desktopSize.height - size.height) * positionPercentage.y),
  };
  windowSetMeta(id, { position });
}

export function windowRestore(id: string) {
  windowStore.mutate(state => {
    const window = getWindowFromState(state, id);

    if (!window.meta?.resizable) {
      return;
    }

    window.meta.minimized = false;
  });

  windowFocus(id);
}

export function windowSetDesktopSize(size: ObjectSize) {
  windowStore.mutate(state => {
    state.desktopSize = size;
    state.smallScreen = size.width <= SmallScreenMinWidth;
  });
}

export function windowSetMeta(id: string, meta: Partial<WindowMeta>) {
  const { all } = windowStore.state;
  const currentWindow = all.get(id);
  if (!currentWindow) {
    throw new Error(`Window ${id} does not exist`);
  }

  if (!currentWindow.meta) {
    throw new Error(`Window ${id} was not initialized`);
  }

  const {
    icon,
    invisible,
    minimizable,
    position,
    resizable,
    size,
    title,
  } = meta;

  const newMeta: WindowMeta = {
    ...currentWindow.meta,
  };

  if (icon) {
    newMeta.icon = icon;
  }

  if (invisible !== undefined) {
    newMeta.invisible = invisible;
  }

  if (minimizable) {
    newMeta.minimizable = minimizable;
  }

  if (position) {
    newMeta.position = position;
  }

  if (resizable) {
    newMeta.resizable = resizable;
  }

  if (size) {
    // TODO: Calculate if it fits on screen
    newMeta.size = size;
  }

  if (title) {
    newMeta.title = title;
  }

  windowStore.mutate(state => {
    state.all.set(id, {
      ...currentWindow,
      meta: newMeta,
    });
  });
}

// # Helpers

export function getWindowFromState(state: WindowState, id: string) {
  const { all } = state;
  const window = all.get(id);
  if (!window) {
    throw new Error(`Window ${id} does not exist`);
  }

  return window;
}

export function isZIndexWindowNotMinimized(state: WindowState, zIndex: number) {
  const window = state.allByZIndex.get(zIndex);
  return window && window.meta && !window.meta.minimized;
}

// # Selectors

export function windowGetFocusedId(state: WindowState) {
  return state.desktopFocused
    ? null
    : state.allByZIndex.get(state.lastZIndex)?.id ?? null;
}

export function windowGetPenultimateZIndexNonMinimizedId(state: WindowState) {
  let previousZIndex = state.lastZIndex - 1;
  while (
    previousZIndex > 0 &&
    isZIndexWindowNotMinimized(state, previousZIndex)
  ) {
    previousZIndex -= 1;
  }
  return previousZIndex > 0 ? previousZIndex : 0;
}

export function windowGetAll(state: WindowState) {
  return state.all;
}

export function windowGetDesktopSize(state: WindowState) {
  return state.desktopSize;
}

export function windowGetSmallScreen(state: WindowState) {
  return state.smallScreen;
}
