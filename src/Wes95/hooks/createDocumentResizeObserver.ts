import { onCleanup, onMount } from 'solid-js';

export function createDocumentResizeObserver(callback: () => void) {
  const observer = new ResizeObserver(() => {
    callback();
  });

  onMount(() => {
    observer.observe(document.documentElement);
  });

  onCleanup(() => {
    observer.disconnect();
  });
}
