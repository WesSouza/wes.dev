function adjustPath(path: string) {
  return path.replace('My Document', 'My_Document');
}

export function getRealPublicURL(path: string | undefined) {
  if (!path) {
    return;
  }

  if (path.startsWith('/C/')) {
    return new URL(location.protocol + location.host + adjustPath(path));
  } else if (path.startsWith('http:') || path.startsWith('https:')) {
    return new URL(path);
  } else {
    throw new Error(`Invalid path ${path}`);
  }
}

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
