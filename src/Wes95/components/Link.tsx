import type { JSX } from 'solid-js';
import { WindowManager } from '../lib/WindowManager';

export function Link(p: {} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (event: MouseEvent) => {
    if (event.button !== 0 || !p.href || p.target === '_blank') {
      return;
    }

    const url = new URL(p.href);

    if (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
    ) {
      return;
    }

    const windowUrl =
      url.protocol === 'app:' || url.protocol === 'system:'
        ? p.href
        : `app://InternetExplorer/Main?url=${encodeURIComponent(p.href)}`;

    WindowManager.shared.addWindow(windowUrl, { active: true });
    event.preventDefault();
  };

  return (
    <a {...p} class={`Link ${p.class}`} onClick={handleClick}>
      {p.children}
    </a>
  );
}
