import React, { ReactNode } from 'react';

import { Icons, IconSizes } from '~/constants/Icons';
import { Colors, Scale } from '~/constants/Styles';
import { Symbols } from '~/constants/Symbols';
import { HStack, Spacer, Text, TruncationModes } from '~/ui';

import { Box, BoxProps, BoxTypes } from './Box';
import { Button } from './Button';
import { Icon } from './Icon';
import { Symbol } from './Symbol';

interface Props extends BoxProps {
  children?: ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose: () => void;
  icon?: Icons;
  isActive: boolean;
  isMaximized?: boolean;
  title: string;
}

export enum WindowTypes {
  dialog,
  modal,
  window,
}

export function Window({
  children,
  onMinimize,
  onMaximize,
  onClose,
  icon,
  isActive,
  isMaximized,
  title,
}: Props) {
  return (
    <Box type={BoxTypes.window}>
      <HStack
        padding={Scale * 2}
        foregroundColor={isActive ? Colors.white : Colors.lightGray}
        backgroundColor={isActive ? Colors.blue : Colors.darkGray}
      >
        {icon !== undefined && (
          <Icon
            icon={icon}
            paddingTrailing={Scale * 3}
            size={IconSizes.small}
          />
        )}

        <Text bold={true} truncationMode={TruncationModes.tail}>
          {title}
        </Text>

        <Spacer />

        {onMinimize && (
          <Button onPress={onMinimize}>
            <Symbol symbol={Symbols.windowMinimize} />
          </Button>
        )}
        {onMaximize && (
          <Button onPress={onMaximize}>
            <Symbol
              symbol={
                isMaximized ? Symbols.windowRestore : Symbols.windowMaximize
              }
            />
          </Button>
        )}

        <Button onPress={onClose} marginLeading={Scale * 2}>
          <Symbol symbol={Symbols.windowClose} />
        </Button>
      </HStack>
      {children}
    </Box>
  );
}
