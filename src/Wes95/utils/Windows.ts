export function addActiveWindowToHistory(
  windowId: string,
  activeWindowHistory: string[],
) {
  activeWindowHistory.unshift(windowId);
  return [windowId, ...activeWindowHistory.filter((id) => id !== windowId)];
}
