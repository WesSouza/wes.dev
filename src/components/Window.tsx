import React, { ReactNode, useCallback, useRef, memo } from 'react';

import { ObjectPosition } from '~/constants/CommonTypes';
import { IconSizes } from '~/constants/Icons';
import { Colors, Scale, ZIndexes } from '~/constants/Styles';
import { Symbols } from '~/constants/Symbols';
import { useWindowDragResize } from '~/hooks/useWindowDragResize';
import { WindowMeta } from '~/state';
import {
  Cursors,
  HorizontalAlignments,
  HStack,
  Pressable,
  Spacer,
  Text,
  Themes,
  TruncationModes,
  VStack,
} from '~/ui';

import { Button } from './Button';
import { Icon } from './Icon';
import { Symbol } from './Symbol';

const DefaultMinimumSize = { width: 200, height: 100 };
const DefaultMaximumSize = { width: Infinity, height: Infinity };

interface Props {
  focused: boolean;
  children?: ReactNode;
  meta: WindowMeta | null;
  onClose: () => void;
  onFocus: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onMove?: (coords: ObjectPosition) => void;
  zIndex: number;
}

export enum WindowTypes {
  dialog = 'dialog',
  modal = 'modal',
  window = 'window',
}

export function WindowComponent({
  focused,
  children,
  meta,
  onClose,
  onFocus,
  onMaximize,
  onMinimize,
  onMove,
  zIndex,
}: Props) {
  const windowRef = useRef<HTMLDivElement>(null);

  const handleFocus = useCallback(() => {
    if (!focused) {
      onFocus();
    }
  }, [focused, onFocus]);

  const {
    x: movingX,
    y: movingY,
    width: resizingWidth,
    height: resizingHeight,
    handlers,
  } = useWindowDragResize({
    onDragEnd: onMove,
    resizeMinimum: meta?.minSize ?? DefaultMinimumSize,
    resizeMaximum: meta?.maxSize ?? DefaultMaximumSize,
    windowRef,
  });

  if (!meta) {
    return null;
  }

  const {
    icon,
    invisible,
    maximized,
    minimizable,
    position,
    resizable,
    title,
    size: { width: stateWidth, height: stateHeight },
  } = meta;

  let x = 0;
  let y = 0;
  let theme = Themes.frame;

  if (maximized) {
    x = 0;
    y = 0;
    theme = Themes.basic;
  } else {
    x = movingX ?? position?.x ?? 0;
    y = movingY ?? position?.y ?? 0;
  }

  const width: number = resizingWidth ?? stateWidth;
  const height: number = resizingHeight ?? stateHeight;
  const maximizableWidth = maximized ? '100%' : width;
  const maximizableHeight = maximized ? '100%' : height;

  return (
    <VStack
      alignment={HorizontalAlignments.stretch}
      focusable={true}
      height={maximizableHeight}
      invisible={invisible}
      nativeRef={windowRef}
      padding={Scale * 1}
      theme={theme}
      UNSTABLE_onPressDown={handleFocus}
      width={maximizableWidth}
      x={x}
      y={y}
      zIndex={zIndex}
    >
      <HStack
        backgroundColor={focused ? Colors.blue : Colors.darkGray}
        foregroundColor={focused ? Colors.white : Colors.lightGray}
        padding={Scale * 2}
        shrink={0}
      >
        {icon && (
          <Icon icon={icon} marginTrailing={Scale * 3} size={IconSizes.small} />
        )}
        <Text
          bold={true}
          marginTrailing={Scale * 10}
          truncationMode={TruncationModes.tail}
        >
          {title}
        </Text>
        <Spacer />
        {minimizable && (
          <Button
            onPress={onMinimize}
            padding={Scale * 1}
            zIndex={ZIndexes.windowControls}
          >
            <Symbol symbol={Symbols.windowMinimize} />
          </Button>
        )}
        {resizable && (
          <Button
            onPress={onMaximize}
            padding={Scale * 1}
            zIndex={ZIndexes.windowControls}
          >
            <Symbol
              symbol={
                maximized ? Symbols.windowRestore : Symbols.windowMaximize
              }
            />
          </Button>
        )}
        <Button
          marginLeading={Scale * 2}
          onPress={onClose}
          padding={Scale * 1}
          zIndex={ZIndexes.windowControls}
        >
          <Symbol symbol={Symbols.windowClose} />
        </Button>

        <Pressable
          height={Scale * 20}
          onDoublePress={onMaximize}
          onPressDown={!maximized ? handlers.move : undefined}
          width={maximizableWidth}
          x={Scale * 3}
          y={Scale * 3}
          zIndex={ZIndexes.windowMovement}
        />
        {!maximized && resizable && (
          <>
            <Pressable
              height={Scale * 15}
              onPressDown={handlers.resizeNw}
              width={Scale * 15}
              x={Scale * -3}
              y={Scale * -3}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.nwseResize}
            />
            <Pressable
              height={Scale * 10}
              onPressDown={handlers.resizeN}
              width={width - Scale * 24}
              x={Scale * 12}
              y={Scale * -3}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.nsResize}
            />
            <Pressable
              height={Scale * 15}
              onPressDown={handlers.resizeNe}
              width={Scale * 15}
              x={width - Scale * 12}
              y={Scale * -3}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.neswResize}
            />
            <Pressable
              height={height - Scale * 24}
              onPressDown={handlers.resizeW}
              width={Scale * 15}
              x={Scale * -3}
              y={Scale * 12}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.ewResize}
            />
            <Pressable
              height={height - Scale * 24}
              onPressDown={handlers.resizeE}
              width={Scale * 15}
              x={width - Scale * 12}
              y={Scale * 12}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.ewResize}
            />
            <Pressable
              height={Scale * 15}
              onPressDown={handlers.resizeSw}
              width={Scale * 15}
              x={Scale * -3}
              y={height - Scale * 12}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.neswResize}
            />
            <Pressable
              height={Scale * 15}
              onPressDown={handlers.resizeS}
              width={width - Scale * 24}
              x={Scale * 12}
              y={height - Scale * 12}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.nsResize}
            />
            <Pressable
              height={Scale * 15}
              onPressDown={handlers.resizeSe}
              width={Scale * 15}
              x={width - Scale * 12}
              y={height - Scale * 12}
              zIndex={ZIndexes.windowResize}
              cursor={Cursors.nwseResize}
            />
          </>
        )}
      </HStack>
      {children}
    </VStack>
  );
}

export const Window = memo(WindowComponent);
