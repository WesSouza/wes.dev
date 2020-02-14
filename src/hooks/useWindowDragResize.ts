import React, { RefObject, useCallback, useRef } from 'react';

import {
  ObjectPosition,
  ObjectRect,
  ObjectSize,
} from '~/constants/CommonTypes';
import { Scale } from '~/constants/Styles';
import { getBoundingClientRect, getPointerCoords } from '~/utils/dom';

import { useDrag } from './useDrag';

const DefaultWindowOuterOffset = Scale * 3;
const DefaultWindowInnerOffset = Scale * 12;

type Elements =
  | 'move'
  | 'resizeN'
  | 'resizeNw'
  | 'resizeNe'
  | 'resizeE'
  | 'resizeW'
  | 'resizeS'
  | 'resizeSe'
  | 'resizeSw';

type Handlers<T> = Record<
  Elements,
  (event: React.MouseEvent<T> | React.TouchEvent<T>) => void
>;

type Return<T> = {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  handlers: Handlers<T>;
};

export function useWindowDragResize<
  T extends HTMLElement = HTMLDivElement,
  U extends HTMLElement = HTMLButtonElement
>({
  onDragEnd,
  resizeMaximum = { width: Infinity, height: Infinity },
  resizeMinimum = { width: 0, height: 0 },
  windowRef,
}: {
  onDragEnd?: (coords: ObjectPosition) => void;
  resizeMaximum: ObjectSize;
  resizeMinimum: ObjectSize;
  windowRef: RefObject<T>;
}): Return<U> {
  const moveOffsetCoords = useRef<ObjectPosition | null>(null);
  const resizeOffsetX = useRef<number | null>(null);
  const resizeOffsetY = useRef<number | null>(null);
  const operation = useRef<'move' | 'resize' | null>(null);
  const resizeNS = useRef<'north' | 'south' | null>(null);
  const resizeEW = useRef<'east' | 'west' | null>(null);
  const windowRect = useRef<ObjectRect | null>(null);

  const handleReset = useCallback(() => {
    moveOffsetCoords.current = null;
    resizeOffsetX.current = null;
    resizeOffsetY.current = null;
    operation.current = null;
    resizeNS.current = null;
    resizeEW.current = null;
    windowRect.current = null;
  }, []);

  const { pointerCoords: pointerCoordsLive, handleDragStart } = useDrag({
    onDragStart: handleReset,
    onDragEnd,
  });

  const handleBase = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      if ('button' in event && event.button !== 0) {
        return { elementRect: null };
      }

      handleDragStart();

      const windowRectStart = getBoundingClientRect(windowRef);
      const elementRect = getBoundingClientRect(event.currentTarget);
      const pointerCoordsStart = getPointerCoords(event);

      moveOffsetCoords.current = {
        x: pointerCoordsStart.x - elementRect.x,
        y: pointerCoordsStart.y - elementRect.y,
      };
      windowRect.current = windowRectStart;

      return {
        elementRect: windowRectStart,
      };
    },
    [handleDragStart, windowRef],
  );

  const handleMove = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      handleBase(event);

      operation.current = 'move';
      resizeNS.current = null;
      resizeEW.current = null;
      resizeOffsetX.current = null;
      resizeOffsetY.current = null;
    },
    [handleBase],
  );

  const handleResizeN = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = 'north';
      resizeEW.current = null;
      resizeOffsetX.current = null;
      resizeOffsetY.current = elementRect.y + elementRect.height;
    },
    [handleBase],
  );
  const handleResizeNw = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = 'north';
      resizeEW.current = 'west';
      resizeOffsetX.current = elementRect.x + elementRect.width;
      resizeOffsetY.current = elementRect.y + elementRect.height;
    },
    [handleBase],
  );
  const handleResizeNe = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = 'north';
      resizeEW.current = 'east';
      resizeOffsetX.current = elementRect.x;
      resizeOffsetY.current = elementRect.y + elementRect.height;
    },
    [handleBase],
  );
  const handleResizeE = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = null;
      resizeEW.current = 'east';
      resizeOffsetX.current = elementRect.x;
      resizeOffsetY.current = null;
    },
    [handleBase],
  );
  const handleResizeW = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = null;
      resizeEW.current = 'west';
      resizeOffsetX.current = elementRect.x + elementRect.width;
      resizeOffsetY.current = null;
    },
    [handleBase],
  );
  const handleResizeS = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = 'south';
      resizeEW.current = null;
      resizeOffsetX.current = null;
      resizeOffsetY.current = elementRect.y;
    },
    [handleBase],
  );
  const handleResizeSe = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = 'south';
      resizeEW.current = 'east';
      resizeOffsetX.current = elementRect.x;
      resizeOffsetY.current = elementRect.y;
    },
    [handleBase],
  );
  const handleResizeSw = useCallback(
    (event: React.MouseEvent<U> | React.TouchEvent<U>) => {
      const { elementRect } = handleBase(event);
      if (!elementRect) {
        return;
      }

      operation.current = 'resize';
      resizeNS.current = 'south';
      resizeEW.current = 'west';
      resizeOffsetX.current = elementRect.x + elementRect.width;
      resizeOffsetY.current = elementRect.y;
    },
    [handleBase],
  );

  const handlers: Handlers<U> = {
    move: handleMove,
    resizeN: handleResizeN,
    resizeNw: handleResizeNw,
    resizeNe: handleResizeNe,
    resizeE: handleResizeE,
    resizeW: handleResizeW,
    resizeS: handleResizeS,
    resizeSe: handleResizeSe,
    resizeSw: handleResizeSw,
  };

  const result: Return<U> = {
    x: windowRect.current?.x ?? null,
    y: windowRect.current?.y ?? null,
    height: windowRect.current?.height ?? null,
    width: windowRect.current?.width ?? null,
    handlers,
  };

  if (!pointerCoordsLive || !windowRect.current || !moveOffsetCoords.current) {
    return result;
  }

  if (operation.current === 'move') {
    result.x =
      pointerCoordsLive.x -
      moveOffsetCoords.current.x -
      DefaultWindowOuterOffset;
    result.y =
      pointerCoordsLive.y -
      moveOffsetCoords.current.y -
      DefaultWindowOuterOffset;
  }

  if (
    operation.current === 'resize' &&
    resizeEW.current === 'east' &&
    resizeOffsetX.current
  ) {
    result.width =
      pointerCoordsLive.x -
      resizeOffsetX.current -
      moveOffsetCoords.current.x +
      DefaultWindowInnerOffset;
  }

  if (
    operation.current === 'resize' &&
    resizeEW.current === 'west' &&
    resizeOffsetX.current
  ) {
    result.x =
      pointerCoordsLive.x -
      moveOffsetCoords.current.x +
      DefaultWindowOuterOffset;
    result.width =
      resizeOffsetX.current -
      pointerCoordsLive.x +
      moveOffsetCoords.current.x -
      DefaultWindowOuterOffset;
  }

  if (
    operation.current === 'resize' &&
    resizeNS.current === 'south' &&
    resizeOffsetY.current
  ) {
    result.height =
      pointerCoordsLive.y -
      resizeOffsetY.current -
      moveOffsetCoords.current.y +
      DefaultWindowInnerOffset;
  }

  if (
    operation.current === 'resize' &&
    resizeNS.current === 'north' &&
    resizeOffsetY.current
  ) {
    result.y =
      pointerCoordsLive.y -
      moveOffsetCoords.current.y +
      DefaultWindowOuterOffset;
    result.height =
      resizeOffsetY.current -
      pointerCoordsLive.y +
      moveOffsetCoords.current.y -
      DefaultWindowOuterOffset;
  }

  if (result.width && result.width < resizeMinimum.width) {
    result.width = resizeMinimum.width;
  }
  if (result.width && result.width > resizeMaximum.width) {
    result.width = resizeMaximum.width;
  }
  if (result.height && result.height < resizeMinimum.height) {
    result.height = resizeMinimum.height;
  }
  if (result.height && result.height > resizeMaximum.height) {
    result.height = resizeMaximum.height;
  }

  return result;
}
