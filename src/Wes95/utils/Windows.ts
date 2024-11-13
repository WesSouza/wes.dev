import type { WindowManagerState } from '../lib/WindowManager';
import type { WindowState } from '../models/WindowState';

export function addActiveWindowToHistory(
  windowId: string,
  activeWindowHistory: string[],
) {
  activeWindowHistory.unshift(windowId);
  return [windowId, ...activeWindowHistory.filter((id) => id !== windowId)];
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
  console.log(windowsChildrenMap);

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
