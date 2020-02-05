import React, { useCallback } from 'react';

import { Button, Icon } from '~/components';
import { IconSizes } from '~/constants/Icons';
import { Scale } from '~/constants/Styles';
import { useSelector } from '~/hooks/useSelector';
import { Window, windowGetSmallScreen, windowStore } from '~/state';
import { HStack, Text, TruncationModes, VStack } from '~/ui';

interface Props {
  focused: boolean;
  onPress: (id: string) => void;
  window: Window;
}

export function TaskbarItem({ focused, onPress, window }: Props) {
  const smallScreen = useSelector(windowStore, windowGetSmallScreen);

  const { id, meta } = window;

  const handlePress = useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  if (!meta?.minimizable) {
    return null;
  }

  const { icon, title } = meta;

  return (
    <Button
      active={focused}
      onPress={handlePress}
      padding={Scale * 1}
      width={Scale * (smallScreen ? 30 : 150)}
    >
      {smallScreen ? (
        <VStack>{icon && <Icon icon={icon} size={IconSizes.small} />}</VStack>
      ) : (
        <HStack>
          {icon && <Icon icon={icon} size={IconSizes.small} />}
          <Text
            bold={true}
            marginLeading={Scale * 4}
            marginTrailing={Scale * 4}
            truncationMode={TruncationModes.tail}
          >
            {title}
          </Text>
        </HStack>
      )}
    </Button>
  );
}
