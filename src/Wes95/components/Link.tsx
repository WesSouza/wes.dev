import type { JSX } from 'solid-js';
import { WindowManager } from '../lib/WindowManager';

export function Link(p: {} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (event: MouseEvent) => {
    if (event.button !== 0 || !p.href) {
      return;
    }

    const url = new URL(p.href);

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
      WindowManager.shared.addWindow(windowUrl, { active: true });
      event.preventDefault();
    }
  };

  return (
    <a {...p} class={`Link ${p.class}`} onClick={handleClick}>
      {p.children}
    </a>
  );
}
