export type URLObject = {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  searchParams: URLSearchParams;
  toString: () => string;
  username: string;
};

function adjustPath(path: string) {
  return path.replace('My Document', 'My_Document');
}

export const createURL = (urlString: string): URLObject => {
  const url = new URL(urlString);

  if (url.hostname !== '' || !/^\/\//.test(url.pathname)) {
    return urlToObject(url);
  }

  // Fuck Firefox
  const matches = url.pathname.match(/\/\/(?<hostname>[^/]+)(?<pathname>.+)/);
  if (!matches?.groups?.hostname || !matches?.groups?.pathname) {
    throw new Error('Unable to infer hostname and pathname from pathname');
  }

  return {
    ...urlToObject(url),
    hostname: matches.groups.hostname,
    pathname: matches.groups.pathname,
  };
};

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
  return createURL(url).hostname;
}

export function isAppURL(string: string) {
  try {
    const url = createURL(string);
    return ['app:', 'system:'].includes(url.protocol) ? url : undefined;
  } catch {
    return;
  }
}

export const urlToObject = (url: URL) => {
  return {
    hash: url.hash,
    host: url.host,
    hostname: url.hostname,
    href: url.href,
    origin: url.origin,
    password: url.password,
    pathname: url.pathname,
    port: url.port,
    protocol: url.protocol,
    get search() {
      const search = this.searchParams.toString();
      return search ? '?' + search : '';
    },
    searchParams: url.searchParams,
    toString() {
      return this.protocol + '//' + this.hostname + this.pathname + this.search;
    },
    username: url.username,
  };
};
