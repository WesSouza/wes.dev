import React, { useCallback, useRef, useState } from 'react';

import { getPointerCoords } from '~/utils/dom';
import { rafDebounce } from '~/utils/rafDebounce';

export interface ButtonEvent {
  contextPress: boolean;
}

export function useButtonPress({
  justPressedTimerDuration = 10,
  preventDefaultContextMenu = false,
  onPress,
  onPressDown,
  onPressUp,
}: {
  justPressedTimerDuration?: number;
  onPress?: (event: ButtonEvent) => void;
  onPressDown?: (event: ButtonEvent) => void;
  onPressUp?: (event: ButtonEvent) => void;
  preventDefaultContextMenu?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const justPressed = useRef(false);
  const justPressedTimer = useRef<number>();
  const pressDownElementRect = useRef([0, 0, 0, 0]);
  const pressing = useRef(false);
  const syntheticEvent = useRef<ButtonEvent>({ contextPress: false });

  const handleMove = useCallback(
    rafDebounce((event: MouseEvent | TouchEvent) => {
      if (!pressing.current || syntheticEvent.current) {
        return;
      }

      const elementRect = pressDownElementRect.current;
      const pointerCoords = getPointerCoords(event);
      if (!pointerCoords) {
        return;
      }

      if (
        pressed &&
        (pointerCoords.x < elementRect[0] ||
          pointerCoords.y < elementRect[1] ||
          pointerCoords.x > elementRect[2] ||
          pointerCoords.y > elementRect[3])
      ) {
        setPressed(false);
        return;
      }

      if (
        !pressed &&
        pointerCoords.x >= elementRect[0] &&
        pointerCoords.y >= elementRect[1] &&
        pointerCoords.x <= elementRect[2] &&
        pointerCoords.y <= elementRect[3]
      ) {
        setPressed(true);
        return;
      }
    }),
    [pressed],
  );

  const handlePressUp = useCallback(() => {
    onPressUp?.(syntheticEvent.current);

    if (syntheticEvent.current.contextPress) {
      onPress?.(syntheticEvent.current);
      return;
    }

    setPressed(false);

    if (pressed) {
      justPressed.current = true;
      justPressedTimer.current = window.setTimeout(() => {
        justPressed.current = false;
        window.clearTimeout(justPressedTimer.current);
      }, justPressedTimerDuration);

      onPress?.(syntheticEvent.current);
    }

    pressing.current = false;

    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handlePressUp);
    document.removeEventListener('touchend', handlePressUp);
  }, [handleMove, justPressedTimerDuration, onPress, onPressUp, pressed]);

  const handlePressDown = useCallback(
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>,
    ) => {
      syntheticEvent.current.contextPress =
        'button' in event && event.button === 2;
      onPressDown?.(syntheticEvent.current);

      if (syntheticEvent.current.contextPress && preventDefaultContextMenu) {
        event.preventDefault();
      }

      if (syntheticEvent.current.contextPress) {
        return;
      }

      setPressed(true);

      const { currentTarget: element } = event;
      const { x, y, width, height } = element.getBoundingClientRect();
      pressDownElementRect.current = [x, y, x + width, y + height];

      pressing.current = true;

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handlePressUp);
      document.addEventListener('touchend', handlePressUp);
    },
    [handleMove, handlePressUp, onPressDown, preventDefaultContextMenu],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (preventDefaultContextMenu) {
        event.preventDefault();
      }
    },
    [preventDefaultContextMenu],
  );

  const handlePress = useCallback(() => {
    if (justPressed.current) {
      return;
    }

    onPress?.(syntheticEvent.current);
  }, [onPress]);

  return {
    pressed,
    handleContextMenu,
    handlePress,
    handlePressDown,
  };
}
