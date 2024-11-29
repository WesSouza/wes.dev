export function getURLHostname(url: string) {
  return new URL(url).hostname;
}

export function isAppURL(string: string) {
  try {
    const url = new URL(string);
    return ['app:', 'system:'].includes(url.protocol) ? url : undefined;
  } catch {
    return;
  }
}
