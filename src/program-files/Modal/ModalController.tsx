import { memo, useEffect } from 'react';

import { useCollectionItem } from '~/hooks/useCollectionItem';
import { useSelector } from '~/hooks/useSelector';
import {
  Modal,
  ModalState,
  modalStore,
  windowGetDesktopSize,
  windowInit,
  WindowMeta,
  windowStore,
} from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';

export function ModalControllerComponent({ window }: ApplicationWindowProps) {
  const { file: modalId } = window;
  const modal = useCollectionItem<Modal, ModalState>(
    modalStore,
    'all',
    modalId,
  );
  const desktopSize = useSelector(windowStore, windowGetDesktopSize);
  const { file, id } = window;

  useEffect(() => {
    if (!modal) {
      return;
    }

    const meta: WindowMeta = {
      icon: null,
      invisible: true,
      maximized: false,
      minSize: null,
      maxSize: null,
      minimizable: false,
      minimized: false,
      position: null,
      resizable: false,
      size: {
        width: Math.min(360, desktopSize.width),
        height: desktopSize.height,
      },
      title: modal.title,
    };

    windowInit(id, meta);
  }, [desktopSize.height, desktopSize.width, file, id, modal]);

  return null;
}

export const ModalController = memo(ModalControllerComponent);
