import type { WindowState } from '../models/WindowState';
import { ScreenManager } from './ScreenManager';
import { WindowManager } from './WindowManager';

let shared: SessionManager | undefined;

const Tokens: Record<
  'apps' | 'parameters' | 'values',
  Record<string, string>
> = {
  apps: {
    bsky: 'Bluesky/Profile',
    bskys: 'Bluesky/PostSearch',
    bskyt: 'Bluesky/PostThread',
    calc: 'Calculator/Main',
    cmd: 'Command/Main',
    defrag: 'DiskDefragmenter/Main',
    explorer: 'FileExplorer/Main',
    iexplore: 'InternetExplorer/Main',
    mplayer: 'MediaPlayer/Main',
    notepad: 'Notepad/Main',
    paint: 'Paint/Main',
    sol: 'Solitaire/Main',
    wordpad: 'WordPad/Main',
  },
  parameters: {
    did: 'did',
    f: 'file',
    p: 'path',
    q: 'q',
    u: 'url',
    uri: 'uri',
  },
  values: {
    weldoc: '/C/My Documents/Welcome.doc',
  },
};

const InvertedTokens = Object.fromEntries(
  Object.entries(Tokens).map(([key, tokens]) => [
    key,
    Object.fromEntries(
      Object.entries(tokens).map(([key, value]) => [value, key]),
    ),
  ]),
) as Record<'apps' | 'parameters' | 'values', Record<string, string>>;

function parseMaybeZero(string: string | undefined) {
  if (string?.includes('.')) {
    return parseFloat(string);
  }

  return parseFloat('0.' + string);
}

export class SessionManager {
  static get shared() {
    if (!shared) {
      shared = new SessionManager();
    }

    return shared;
  }

  screenManager = ScreenManager.shared;
  windowManager = WindowManager.shared;
  initialized = false;

  constructor() {}

  encode = () => {
    const desktopSize = this.screenManager.desktopSize();
    if (!desktopSize) {
      return;
    }

    let activeIndex = 0;
    const params = new URLSearchParams();
    for (let i = 0; i < this.windowManager.state.windows.length; i++) {
      const window = this.windowManager.state.windows[i]!;
      const url = new URL(window.url);
      const appToken = InvertedTokens.apps[url.hostname + url.pathname];
      if (!appToken) {
        continue;
      }

      const encodedParams = [];
      for (const [key, value] of url.searchParams.entries()) {
        const paramToken = InvertedTokens.parameters[key];
        if (!paramToken) {
          continue;
        }

        const valueToken = InvertedTokens.values[value];
        if (valueToken) {
          encodedParams.push(`${paramToken}*${valueToken}`);
        } else {
          encodedParams.push(`${paramToken}*${value}`);
        }
      }

      const x = (window.x / desktopSize.width).toFixed(5).replace('0.', '');
      const y = (window.y / desktopSize.width).toFixed(5).replace('0.', '');
      const width = (window.width / desktopSize.width)
        .toFixed(5)
        .replace('0.', '');
      const height = (window.height / desktopSize.width)
        .toFixed(5)
        .replace('0.', '');

      params.append(
        'w',
        [
          appToken,
          ...encodedParams,
          x,
          y,
          width,
          height,
          window.maximized ? '2' : window.minimized ? '0' : '1',
        ].join('*'),
      );

      if (this.windowManager.state.activeTaskWindow === window.id) {
        activeIndex = i;
      }
    }

    params.append('a', activeIndex.toString());

    return params.toString();
  };

  restoreFromLocation = (options?: { cleanState?: () => void }) => {
    const desktopSize = this.screenManager.desktopSize();
    if (!desktopSize || this.initialized) {
      return;
    }

    let activeIndex: number | undefined;
    const windows: WindowState[] = [];
    const url = new URL(location.href);
    for (const [key, value] of url.searchParams) {
      if (key === 'a' && /^\d$/.test(value)) {
        activeIndex = Number(value);
      }

      if (key === 'w') {
        const params = value.split('*');
        const tokenApp = params.shift()!;
        const app = Tokens.apps[tokenApp];
        const state = params.pop();
        const height = parseMaybeZero(params.pop());
        const width = parseMaybeZero(params.pop());
        const y = parseMaybeZero(params.pop());
        const x = parseMaybeZero(params.pop());

        if (!app || params.length % 2 !== 0) {
          continue;
        }

        const url = new URL('app://' + app);

        for (let i = 0; i < params.length; i += 2) {
          const key = Tokens.parameters[params[i]!];
          const value = params[i + 1]!;

          if (!key) {
            continue;
          }

          url.searchParams.append(key, Tokens.values[value] ?? value);
        }

        const window = this.windowManager.addWindow(url.toString(), {
          maximized: state === '2',
          minimized: state === '0',
          position: {
            x: desktopSize.width * x,
            y: desktopSize.height * y,
          },
          size: {
            width: desktopSize.width * width,
            height: desktopSize.height * height,
          },
        });

        if (window) {
          windows.push(window);
        }
      }
    }

    if (activeIndex !== undefined) {
      this.windowManager.setActiveWindow(windows[activeIndex]);
    }

    if (windows.length === 0) {
      options?.cleanState?.();
    }

    this.initialized = true;
  };
}
