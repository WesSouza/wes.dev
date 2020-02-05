import React, { useCallback } from 'react';

import { Window } from '~/components';
import { ObjectPosition } from '~/constants/CommonTypes';
import { useCollectionItem } from '~/hooks/useCollectionItem';
import { useSelector } from '~/hooks/useSelector';
import {
  Window as WindowType,
  windowClose,
  windowFocus,
  windowGetFocusedId,
  windowMaximizeRestore,
  windowMinimize,
  windowSetMeta,
  windowStore,
} from '~/state';

const ComponentMap = {};

export interface ApplicationWindowProps {
  window: WindowType;
}

interface Props {
  id: string;
}

function ApplicationWindowComponent({ id }: Props) {
  const window = useCollectionItem(windowStore, 'all', id) as WindowType;
  if (!window) {
    throw new Error(`Window ${id} does not exist`);
  }

  const { app, meta, zIndex } = window;
  if (!(app in ComponentMap)) {
    throw new Error(`Unknown application ${app}`);
  }

  const handleClose = useCallback(() => {
    windowClose(id);
  }, [id]);

  const handleFocus = useCallback(() => {
    windowFocus(id);
  }, [id]);

  const handleMaximize = useCallback(() => {
    windowMaximizeRestore(id);
  }, [id]);

  const handleMinimize = useCallback(() => {
    windowMinimize(id);
  }, [id]);

  const handleMove = useCallback(
    (position: ObjectPosition) => {
      windowSetMeta(id, { position });
    },
    [id],
  );

  const focusedId = useSelector(windowStore, windowGetFocusedId);
  const focused = focusedId === id;

  const ApplicationComponent = ComponentMap[app].component;
  const ApplicationController = ComponentMap[app].controller;
  return (
    <>
      <ApplicationController window={window} />
      {!window.meta?.minimized && (
        <Window
          focused={focused}
          meta={meta}
          onClose={handleClose}
          onFocus={handleFocus}
          onMaximize={handleMaximize}
          onMinimize={handleMinimize}
          onMove={handleMove}
          zIndex={zIndex}
        >
          <ApplicationComponent window={window} />
        </Window>
      )}
    </>
  );
}

export const ApplicationWindow = React.memo(ApplicationWindowComponent);