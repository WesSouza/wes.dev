import { RefObject, useEffect } from 'react';

import { ObjectPosition } from '~/constants/CommonTypes';
import { Scale } from '~/constants/Styles';
import { Window, windowPositionProportionally, windowSetMeta } from '~/state';
import { getBoundingClientRect } from '~/utils/dom';

const WindowChromeSize = { width: Scale * 6, height: Scale * 26 };

export function useAutoHeightWindow<T extends HTMLElement>(
  elementRef: RefObject<T>,
  window: Window,
  positionProportion?: ObjectPosition,
) {
  const { id, meta } = window;

  useEffect(() => {
    if (!elementRef.current || !meta) {
      return;
    }

    const rect = getBoundingClientRect(elementRef.current);
    windowSetMeta(id, {
      size: {
        width: meta.size.width,
        height: WindowChromeSize.height + rect.height,
      },
    });
    if (positionProportion) {
      windowPositionProportionally(id, positionProportion);
    }

    windowSetMeta(id, {
      invisible: false,
    });
  }, [elementRef, id, meta, positionProportion]);
}
