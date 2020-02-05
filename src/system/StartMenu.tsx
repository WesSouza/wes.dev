import React, { useCallback, useRef } from 'react';

import { Button, Icon, Menu, MenuTree } from '~/components';
import { Apps } from '~/constants/Apps';
import { Icons, IconSizes } from '~/constants/Icons';
import { Scale } from '~/constants/Styles';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useMenu } from '~/hooks/useMenu';
import { useSelector } from '~/hooks/useSelector';
import {
  windowGetSmallScreen,
  windowStore,
  modalOpen,
  windowOpen,
} from '~/state';
import { HStack, Text, VStack } from '~/ui';
import { getOffsetRect } from '~/utils/dom';

interface Props {}

const menu: MenuTree = [
  'Start',
  [
    [
      '&Programs',
      [
        ['Calculator', 'app.calc', Icons.iconCalc],
        ['Disk Defragmenter', 'app.defrag', Icons.iconDefrag],
        ['Instagram', 'app.instagram', Icons.iconInstagram],
        ['Internet Explorer', 'app.iexplore', Icons.iconIexplorer],
        ['Notepad', 'app.notepad', Icons.iconNotepad],
        ['Paint', 'app.wspaint', Icons.iconPaint],
        ['Spotify', 'app.spotify', Icons.iconMplayer],
        ['Wes Explorer', 'app.explorer', Icons.iconExplorer],
      ],
      Icons.iconProgramsFolder,
    ],
    [
      '&Documents',
      [['hello-world.txt', 'app.notepad:hello-world.txt', Icons.fileTypeText]],
      Icons.iconDocumentsFolder,
    ],
    ['&Settings', 'settings', Icons.iconSettings],
    ['&Find', 'find', Icons.iconFind],
    ['&Help', 'help', Icons.iconHelp],
    ['&Run', 'run', Icons.iconRun],
    ['-'],
    ['Suspe&nd', 'suspend', Icons.iconSuspend],
    ['Sh&utdown', 'shutdown', Icons.iconShutdown],
  ],
];

export function StartMenu({}: Props) {
  const smallScreen = useSelector(windowStore, windowGetSmallScreen);
  const handleCancelRef = useRef<(() => void) | null>(null);

  const handleMenuSelect = useCallback((action: string | null) => {
    handleCancelRef.current?.();

    if (action?.startsWith('app.')) {
      const appName = action.replace(/^app\./, '').replace(/:.+$/, '');
      const appFile = action.includes(':')
        ? action.replace(/^app\.[^:]+\:/, '')
        : undefined;

      if (!(appName in Apps)) {
        modalOpen({
          actions: [['Ok', 'close']],
          content: `Application '${appName.toUpperCase()}.EXE' cannot be found.`,
          icon: Icons.dialogError,
          title: 'Error',
        });
        return;
      }

      windowOpen(Apps[appName as Apps], appFile);
      return;
    }

    switch (action) {
      case 'help':
        modalOpen({
          actions: [['Ok', 'close']],
          content: "I'm sorry, Dave.\n\nI'm afraid I can't do that.",
          icon: Icons.dialogError,
          title: 'Oh no',
        });
        return;
    }

    modalOpen({
      actions: [['Ok', 'close']],
      content: "I'm still developing this, please try again next week.",
      icon: Icons.dialogWarning,
      title: 'Oh no',
    });
  }, []);

  const {
    activeMenu,
    subMenu,
    subMenuPosition,
    handleCancel,
    handleSelect,
  } = useMenu({
    onMenuItemSelect: handleMenuSelect,
  });
  handleCancelRef.current = handleCancel;

  const { elementRef: containerRef } = useClickOutside<HTMLDivElement>({
    onClickOutside: handleCancelRef.current,
  });

  const handleOpen = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const rect = getOffsetRect(containerRef.current);
    handleSelect({
      menu,
      position: { invertY: true, x: Scale * 2, y: Scale * 2 + rect.height },
    });
  }, [containerRef, handleSelect]);

  return (
    <VStack nativeRef={containerRef}>
      <Button
        onPress={handleOpen}
        padding={Scale * 1}
        pressed={Boolean(activeMenu)}
      >
        <HStack>
          <Icon icon={Icons.iconStart} size={IconSizes.small} />
          {!smallScreen && (
            <Text
              bold={true}
              marginLeading={Scale * 4}
              marginTrailing={Scale * 4}
            >
              Start
            </Text>
          )}
        </HStack>
      </Button>
      {subMenu && (
        <Menu
          menu={subMenu}
          onMenuSelect={handleMenuSelect}
          position={subMenuPosition}
        ></Menu>
      )}
    </VStack>
  );
}
