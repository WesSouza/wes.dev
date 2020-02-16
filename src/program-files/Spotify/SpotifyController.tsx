import { memo, useEffect } from 'react';

import { Icons } from '~/constants/Icons';
import { windowInit, WindowMeta, windowPositionProportionally } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';

let first = true;

function SpotifyControllerComponent({ window }: ApplicationWindowProps) {
  const { id } = window;

  useEffect(() => {
    const meta: WindowMeta = {
      icon: Icons.iconMplayer,
      invisible: false,
      maximized: false,
      minSize: { width: 320, height: 200 },
      maxSize: null,
      minimizable: true,
      minimized: false,
      position: first ? { x: 0, y: 0 } : null,
      resizable: false,
      size: { width: 320, height: 400 },
      title: 'Spotify',
    };

    windowInit(id, meta);
    if (first) {
      windowPositionProportionally(id, { x: 0.35, y: 0.35 });
      first = false;
    }
  }, [id]);

  return null;
}

export const SpotifyController = memo(SpotifyControllerComponent);
