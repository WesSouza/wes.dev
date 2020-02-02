import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { StateManager } from '~/utils/StateManager';

// FIXME: How the fuck can I make this generic?
export function useCollectionItem<U, T>(
  stateManager: StateManager<T>,
  collectionKey: keyof T,
  itemKey: string | null,
): U | undefined {
  const collection = stateManager.state[collectionKey];
  if (!(collection instanceof Map)) {
    throw new TypeError('collection must be a Map');
  }

  const initialValue = collection.get(itemKey);
  const value = useRef(initialValue);
  const [, setState] = useState(0);

  const selector = useCallback(
    (state: T): U | undefined => {
      const collection = state[collectionKey];
      if (!(collection instanceof Map)) {
        return;
      }
      return itemKey ? collection.get(itemKey) : undefined;
    },
    [collectionKey, itemKey],
  );

  useLayoutEffect(() => {
    return stateManager.subscribe(selector, newValue => {
      value.current = newValue;
      setState(number => number + 1);
    });
  }, [selector, stateManager]);

  return value.current;
}
