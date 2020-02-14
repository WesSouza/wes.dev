import { useEffect, useState, useCallback } from 'react';

import { rafDebounce } from '~/utils/rafDebounce';

export function useHostSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(
    rafDebounce(() => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }),
    [],
  );

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return size;
}
