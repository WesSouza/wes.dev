import { useCallback, useRef, useState } from 'react';

import { ObjectPosition } from '~/constants/CommonTypes';
import { getPointerCoords } from '~/utils/dom';
import { rafDebounce } from '~/utils/rafDebounce';

export function useDrag({
  onDragEnd,
  onDragMove,
  onDragStart,
}: {
  onDragEnd?: (coords: ObjectPosition) => void;
  onDragMove?: (coords: ObjectPosition) => void;
  onDragStart?: () => void;
} = {}) {
  const pointerCoordsRef = useRef<ObjectPosition>({ x: 0, y: 0 });
  const [pointerCoords, setPointerCoords] = useState<ObjectPosition | null>(
    null,
  );
  const dragging = useRef(false);

  const handleMove = useCallback(
    rafDebounce((event: MouseEvent | TouchEvent) => {
      if (!dragging.current) {
        return;
      }

      const coords = getPointerCoords(event);
      if (coords) {
        setPointerCoords(coords);
        pointerCoordsRef.current = coords;
      }
      onDragMove?.(pointerCoordsRef.current);
    }),
    [],
  );

  const handleEnd = useCallback(() => {
    dragging.current = false;

    document.documentElement.style.userSelect = '';
    document.documentElement.style.webkitUserSelect = '';
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);

    onDragEnd?.(pointerCoordsRef.current);
  }, [handleMove, onDragEnd]);

  const handleStart = useCallback(() => {
    dragging.current = true;

    document.documentElement.style.userSelect = 'none';
    document.documentElement.style.webkitUserSelect = 'none';
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    setPointerCoords(null);

    onDragStart?.();
  }, [handleMove, handleEnd, onDragStart]);

  return {
    pointerCoords,
    handleDragStart: handleStart,
  };
}
