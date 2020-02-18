import React, { useCallback, useEffect, useRef } from 'react';

import { Apps } from '~/constants/Apps';
import { Colors, ZIndexes } from '~/constants/Styles';
import { useHostSize } from '~/hooks/useHostSize';
import { useSelector } from '~/hooks/useSelector';
import {
  windowFocus,
  windowGetAll,
  windowGetFocusedId,
  windowOpen,
  windowSetDesktopSize,
  windowStore,
} from '~/state';
import { HorizontalAlignments, VStack } from '~/ui';
import { getBoundingClientRect } from '~/utils/dom';

import { ApplicationWindow } from './ApplicationWindow';
import { Taskbar } from './Taskbar';

export function WesExplorer() {
  const focusedId = useSelector(windowStore, windowGetFocusedId);
  const desktop = useRef<HTMLDivElement>(null);
  const windows = useSelector(windowStore, windowGetAll);

  const size = useHostSize();
  useEffect(() => {
    if (!desktop.current) {
      windowSetDesktopSize(size);
      return;
    }

    const desktopSize = getBoundingClientRect(desktop.current);
    windowSetDesktopSize(desktopSize);
  }, [size]);

  useEffect(() => {
    windowOpen(Apps.twitter);
    // windowOpen(Apps.spotify);
    // windowOpen(Apps.instagram);
    // windowOpen(Apps.notepad, 'hello-world.txt');
  }, []);

  const focused = focusedId === null;
  const handleFocus = useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>,
    ) => {
      if (event.target === event.currentTarget && !focused) {
        windowFocus(null);
      }
    },
    [focused],
  );

  const windowComponents: JSX.Element[] = [];
  windows.forEach(window => {
    windowComponents.push(<ApplicationWindow id={window.id} key={window.id} />);
  });

  return (
    <VStack
      alignment={HorizontalAlignments.stretch}
      backgroundColor={Colors.teal}
      grow={1}
    >
      <VStack
        nativeRef={desktop}
        alignment={HorizontalAlignments.stretch}
        grow={1}
        UNSTABLE_css={{ position: 'relative' }}
        UNSTABLE_onPressDown={handleFocus}
        zIndex={ZIndexes.desktop}
      >
        {windowComponents}
      </VStack>
      <Taskbar />
    </VStack>
  );
}
