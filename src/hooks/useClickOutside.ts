import { useEffect, useRef, useCallback } from 'react';

export function useClickOutside<T extends HTMLElement>({
  onClickOutside,
}: {
  onClickOutside: () => void;
}) {
  const elementRef = useRef<T>(null);

  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (
        !elementRef.current ||
        elementRef.current.contains(event.target as Node)
      ) {
        return;
      }

      onClickOutside();
    },
    [onClickOutside],
  );

  const handleAddListeners = useCallback(() => {
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
  }, [handleClick]);

  const handleRemoveListeners = useCallback(() => {
    document.removeEventListener('mousedown', handleClick);
    document.removeEventListener('touchstart', handleClick);
  }, [handleClick]);

  useEffect(() => {
    handleAddListeners();
    return () => {
      handleRemoveListeners();
    };
  }, [handleAddListeners, handleRemoveListeners]);

  return { elementRef, handleAddListeners };
}
