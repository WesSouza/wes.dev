import {
  createResizeObserver,
  type ResizeHandler,
} from '@solid-primitives/resize-observer';

export function createDocumentResizeObserver(
  callback: ResizeHandler<HTMLElement>,
) {
  createResizeObserver(document.documentElement, callback);
}
