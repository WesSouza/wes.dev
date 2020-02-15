import { memo, useEffect } from 'react';

import { Icons } from '~/constants/Icons';
import { windowInit, WindowMeta, windowPositionProportionally } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';

let first = true;

function InstagramControllerComponent({ window }: ApplicationWindowProps) {
  const { id } = window;

  useEffect(() => {
    const meta: WindowMeta = {
      icon: Icons.iconInstagram,
      invisible: false,
      maximized: false,
      minSize: { width: 320, height: 200 },
      maxSize: null,
      minimizable: true,
      minimized: false,
      position: first ? { x: 0, y: 0 } : null,
      resizable: true,
      size: { width: 320, height: 400 },
      title: 'Instagram',
    };

    windowInit(id, meta);
    if (first) {
      windowPositionProportionally(id, { x: 0.6, y: 0.2 });
      first = false;
    }
  }, [id]);

  return null;
}

export const InstagramController = memo(InstagramControllerComponent);
