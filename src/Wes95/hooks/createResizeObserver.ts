import { onCleanup } from 'solid-js';

export function createResizeObserver<T extends HTMLElement>(
  callback: (element: T | undefined) => void,
) {
  let ref: T | undefined;
  const observer = new ResizeObserver(() => {
    callback(ref);
  });

  const setRef = (element: T) => {
    ref = element;
    callback(ref);
    if (element) {
      observer.observe(element);
    }
  };

  onCleanup(() => {
    observer.disconnect();
  });

  return [ref, setRef];
}
