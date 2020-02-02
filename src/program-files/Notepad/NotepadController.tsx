import { memo, useEffect } from 'react';

import { Icons } from '~/constants/Icons';
import { windowInit, WindowMeta, windowPositionProportionally } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';

let first = true;

function NotepadControllerComponent({ window }: ApplicationWindowProps) {
  const { file, id } = window;

  useEffect(() => {
    const fileName = file ?? 'Untitled';
    const meta: WindowMeta = {
      icon: Icons.fileTypeText,
      invisible: false,
      maximized: false,
      minSize: { width: 300, height: 200 },
      maxSize: null,
      minimizable: true,
      minimized: false,
      position: first && file ? { x: 0, y: 0 } : null,
      resizable: true,
      size: { width: 320, height: 300 },
      title: `${fileName} - Notepad`,
    };

    windowInit(id, meta);
    if (first && file) {
      windowPositionProportionally(id, { x: 0.2, y: 0.8 });
      first = false;
    }
  }, [file, id]);

  return null;
}

export const NotepadController = memo(NotepadControllerComponent);
