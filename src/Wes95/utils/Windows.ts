import type { JSX } from 'solid-js/jsx-runtime';
import type { WindowLibrary, WindowManagerState } from '../lib/WindowManager';
import type { Rect } from '../models/Geometry';
import type { WindowState } from '../models/WindowState';
import type { z } from 'zod';

export function addActiveWindowToHistory(
  windowId: string,
  activeWindowHistory: string[],
) {
  activeWindowHistory.unshift(windowId);
  return [windowId, ...activeWindowHistory.filter((id) => id !== windowId)];
}

export function createWindowURL(
  urlString: string,
  object: Record<string, unknown>,
) {
  const url = new URL(urlString);

  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'string' || typeof value === 'number') {
      url.searchParams.append(key, String(value));
    } else if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
    }
  }

  return url.toString();
}

export function createZIndexMap(state: WindowManagerState) {
  const { activeTaskWindowHistory, activeWindowHistory, windows } = state;

  const windowsMap = new Map(windows.map((window) => [window.id, window]));
  const windowsChildrenMap = new Map<string, WindowState[]>();
  const zIndexMap = new Map<string, number>();

  for (let i = 0; i < activeWindowHistory.length; i++) {
    const windowId = activeWindowHistory[i]!;
    const window = windowsMap.get(windowId);
    if (!window || !window.parentId) {
      continue;
    }
    let windowsChildren = windowsChildrenMap.get(window.parentId);
    if (!windowsChildren) {
      windowsChildren = [];
      windowsChildrenMap.set(window.parentId, windowsChildren);
    }
    windowsChildren.push(window);
  }

  let zIndex = 0;

  for (let i = activeTaskWindowHistory.length - 1; i >= 0; i--) {
    const windowId = activeTaskWindowHistory[i]!;
    const window = windowsMap.get(windowId);
    if (!window) {
      continue;
    }

    zIndex++;

    zIndexMap.set(window.id, zIndex);
    const windowChildren = windowsChildrenMap.get(window.id);
    if (!windowChildren || windowChildren.length === 0) {
      continue;
    }
    for (let j = windowChildren.length - 1; j >= 0; j--) {
      const childWindow = windowChildren[j]!;
      zIndex++;
      zIndexMap.set(childWindow.id, zIndex);
    }
  }

  return zIndexMap;
}

export function getRect(window: Rect): Rect;
export function getRect(window: Rect | undefined): Rect | undefined;
export function getRect(window: Rect | undefined): Rect | undefined {
  if (!window) {
    return;
  }

  return {
    width: window.width,
    height: window.height,
    x: window.x,
    y: window.y,
  };
}

export function handleActiveWindows(
  activeWindow: WindowState | undefined,
  parentWindow: WindowState | undefined,
  state: WindowManagerState,
) {
  if (activeWindow) {
    if (activeWindow.showInTaskbar || parentWindow?.showInTaskbar) {
      const activeTaskWindow = parentWindow ?? activeWindow;
      state.activeTaskWindow = activeTaskWindow.id;
      state.activeTaskWindowHistory = addActiveWindowToHistory(
        activeTaskWindow.id,
        state.activeTaskWindowHistory,
      );
    }
    state.activeWindow = activeWindow.id;
    state.activeWindowHistory = addActiveWindowToHistory(
      activeWindow.id,
      state.activeWindowHistory,
    );
  }
  state.windowZIndexMap = createZIndexMap(state);
}

export function parseWindowURL(
  urlString: string,
  windowLibrary: WindowLibrary,
):
  | [
      (
        | ((p: { data: any; window: WindowState }) => JSX.Element)
        | (() => Promise<{
            default: (p: { data: any; window: WindowState }) => JSX.Element;
          }>)
      ),
      z.AnyZodObject,
      URL,
      'sync' | 'async',
    ]
  | never[] {
  const url = new URL(urlString);
  const programName = url.hostname;
  const windowName = url.pathname.replace(/^\//, '').replace(/\\/g, '_');

  const program = windowLibrary[programName];
  if (!program || typeof program !== 'object' || !program.windows[windowName]) {
    return [];
  }

  const { async, schema, window } = program.windows[windowName];
  if (!schema || !window || typeof window !== 'function') {
    return [];
  }

  return [window, schema, url, async ? 'async' : 'sync'];
}
