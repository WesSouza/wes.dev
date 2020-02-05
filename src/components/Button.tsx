import React, { ReactNode } from 'react';

import { ButtonEvent, useButtonPress } from '~/hooks/useButtonPress';
import { Pressable, Themes, ViewProps } from '~/ui';

interface Props extends ViewProps {
  active?: boolean;
  children?: ReactNode;
  onPress?: (event: ButtonEvent) => void;
  onPressDown?: (event: ButtonEvent) => void;
  onPressUp?: (event: ButtonEvent) => void;
  pressed?: boolean;
}

export function Button({
  active,
  children,
  onPress,
  onPressDown,
  onPressUp,
  pressed: keepPressed,
  ...props
}: Props) {
  const {
    pressed,
    handleContextMenu,
    handlePress,
    handlePressDown,
  } = useButtonPress({
    onPress,
    onPressDown,
    onPressUp,
    preventDefaultContextMenu: true,
  });

  return (
    <Pressable
      theme={
        active
          ? Themes.buttonActive
          : keepPressed || pressed
          ? Themes.buttonPressed
          : Themes.button
      }
      onContextMenu={handleContextMenu}
      onPress={handlePress}
      onPressDown={handlePressDown}
      {...props}
    >
      {children}
    </Pressable>
  );
}
