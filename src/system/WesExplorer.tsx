import React from 'react';

import { Button, Desktop, Window, Icon } from '~/components';
import { Icons } from '~/constants/Icons';
import { PaddingValues } from '~/constants/Styles';
import { HStack, Themes, VStack } from '~/ui';

function noop() {}

export function WesExplorer() {
  return (
    <>
      <Desktop>
        <Window
          active={true}
          meta={{
            title: 'Test',
            icon: Icons.fileTypeText,
            maximized: false,
            minimizable: true,
            minimized: false,
            resizable: true,
            position: [10, 10],
            size: [300, 200],
          }}
          onClose={noop}
          onFocus={noop}
        >
          <VStack grow={1} padding={PaddingValues.medium} theme={Themes.frame}>
            Text content
          </VStack>
          <VStack grow={2} padding={PaddingValues.medium} theme={Themes.frame}>
            Text content
          </VStack>
        </Window>
        <Window
          active={false}
          meta={{
            title: 'Test',
            icon: null,
            maximized: false,
            minimizable: true,
            minimized: false,
            resizable: true,
            position: [10, 240],
            size: [300, 200],
          }}
          onClose={noop}
          onFocus={noop}
        >
          <HStack padding={PaddingValues.large}>
            <Button>OK</Button>
            <Button>OK</Button>
            <Button>OK</Button>
          </HStack>
        </Window>
      </Desktop>
    </>
  );
}
