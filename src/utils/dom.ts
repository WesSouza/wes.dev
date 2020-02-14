import { RefObject } from 'react';

export function getBoundingClientRect<T extends HTMLElement>(
  elementOrRef: RefObject<T> | T,
) {
  const element =
    'current' in elementOrRef ? elementOrRef.current : elementOrRef;
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Element is not an instance of HTMLElement`);
  }

  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

export function getOffsetRect<T extends HTMLElement>(
  elementOrRef: RefObject<T> | T,
) {
  const element =
    'current' in elementOrRef ? elementOrRef.current : elementOrRef;
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Element is not an instance of HTMLElement`);
  }

  const rect = element.getBoundingClientRect();
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: rect.width,
    height: rect.height,
  };
}

export function getPointerCoords<T>(
  event: MouseEvent | React.MouseEvent<T> | React.TouchEvent<T> | TouchEvent,
) {
  if ('pageX' in event && 'pageY' in event) {
    return { x: event.pageX, y: event.pageY };
  }

  if ('touches' in event && event.touches[0]) {
    return { x: event.touches[0].pageX, y: event.touches[0].pageY };
  }

  throw new Error(`Unable to locate pointer coordinates`);
}
