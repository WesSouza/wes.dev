import type { JSX } from 'solid-js';
import { WindowManager } from '../lib/WindowManager';
import { createURL } from '../utils/url';

export function Link(
  p: { alwaysExternal?: boolean } & JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  const handleClick = (event: MouseEvent) => {
    if (event.button !== 0 || !p.href || p.alwaysExternal) {
      return;
    }

    const url = createURL(p.href);

    const isApp = url.protocol === 'app:' || url.protocol === 'system:';
    const isHTTP = url.protocol === 'http:' || url.protocol === 'https:';
    const anyKeyboardKey =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

    let windowUrl: string | undefined = undefined;

    if (isHTTP && !anyKeyboardKey) {
      const appUrl = WindowManager.shared.matchURL(p.href);
      if (appUrl) {
        windowUrl = appUrl;
      }
    }

    if (!windowUrl && isApp) {
      windowUrl = p.href;
    }

    if (windowUrl) {
      event.preventDefault();
      WindowManager.shared.addWindow(windowUrl, { active: true });
    }
  };

  return (
    <a {...p} class={`Link ${p.class}`} onClick={handleClick}>
      {p.children}
    </a>
  );
}
