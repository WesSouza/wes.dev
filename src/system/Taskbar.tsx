import React from 'react';

import { Scale, ZIndexes } from '~/constants/Styles';
import { useSelector } from '~/hooks/useSelector';
import {
  windowGetAll,
  windowGetFocusedId,
  windowMinimizeRestore,
  windowStore,
} from '~/state';
import { HStack, Spacer, Themes, VerticalAlignments } from '~/ui';

import { StartMenu } from './StartMenu';
import { SysTray } from './SysTray';
import { TaskbarItem } from './TaskbarItem';

interface Props {}

export function Taskbar({}: Props) {
  const focusedId = useSelector(windowStore, windowGetFocusedId);
  const windows = useSelector(windowStore, windowGetAll);

  const taskbarComponents: JSX.Element[] = [];
  windows.forEach(window => {
    taskbarComponents.push(
      <TaskbarItem
        focused={focusedId === window.id}
        key={window.id}
        onPress={windowMinimizeRestore}
        window={window}
      />,
    );
  });

  return (
    <>
      <HStack
        alignment={VerticalAlignments.top}
        spacing={Scale * 2}
        paddingTop={Scale * 1}
        theme={Themes.frameTop}
        width="100%"
        zIndex={ZIndexes.taskbar}
      >
        <StartMenu />
        <HStack spacing={Scale * 2} wrap={true}>
          {taskbarComponents}
        </HStack>
        <Spacer />
        <SysTray />
      </HStack>
    </>
  );
}
