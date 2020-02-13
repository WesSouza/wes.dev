import React, { memo, useCallback, useRef } from 'react';
import nl2br from 'react-nl2br';

import { Button, Icon } from '~/components';
import { IconSizes } from '~/constants/Icons';
import { PaddingValues, Scale } from '~/constants/Styles';
import { useAutoHeightWindow } from '~/hooks/useAutoHeightWindow';
import { useSelector } from '~/hooks/useSelector';
import { modalAction, modalGetAll, modalStore } from '~/state';
import { ApplicationWindowProps } from '~/system/ApplicationWindow';
import { HStack, Text, VerticalAlignments, VStack } from '~/ui';

function ModalComponent({ window }: ApplicationWindowProps) {
  const { file: modalId } = window;
  const all = useSelector(modalStore, modalGetAll);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useAutoHeightWindow(elementRef, window, {
    x: 0.5,
    y: 0.5,
  });

  const handleAction = useCallback(
    (action: string) => () => {
      if (modalId) {
        modalAction(modalId, action);
      }
    },
    [modalId],
  );

  const modal = all.get(modalId ?? '');
  if (!modal || !modalId) {
    return null;
  }

  return (
    <VStack nativeRef={elementRef} padding={PaddingValues.xLarge}>
      <HStack selfAlignment={VerticalAlignments.stretch}>
        {modal.icon && (
          <Icon
            icon={modal.icon}
            marginTrailing={PaddingValues.xLarge}
            selfAlignment={VerticalAlignments.top}
            size={IconSizes.large}
          />
        )}
        <Text>{nl2br(modal.content)}</Text>
      </HStack>
      <HStack paddingTop={PaddingValues.xxLarge} spacing={PaddingValues.large}>
        {modal.actions.map(([label, command], index) => (
          <Button
            key={command + index}
            onPress={handleAction(command)}
            paddingBottom={Scale * 2}
            paddingLeading={Scale * 10}
            paddingTop={Scale * 2}
            paddingTrailing={Scale * 10}
            width={Scale * 60}
          >
            {label}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}

export const Modal = memo(ModalComponent);
