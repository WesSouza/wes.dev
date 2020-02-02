import React, { MouseEvent, ReactNode } from 'react';

import {
  Colors,
  ObjectBoxColors,
  ObjectBoxShapes,
  Paddings,
  PaddingValues,
} from '~/constants/Styles';
import { Pressable, ViewLayoutProps, ViewStyleProps } from '~/ui';

interface Props extends ViewLayoutProps, ViewStyleProps {
  children?: ReactNode;
  onPress?: (event: MouseEvent<HTMLButtonElement>) => void;
  onPressDown?: (event: MouseEvent<HTMLButtonElement>) => void;
  onPressUp?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  children,
  onPress,
  onPressDown,
  onPressUp,
  ...props
}: Props) {
  const paddingInline = PaddingValues[Paddings.box];
  const paddingBlock = PaddingValues[Paddings.box];

  return (
    <Pressable
      UNSTABLE_css={{
        color: Colors.black,
        ...ObjectBoxColors.box,
        paddingTop: paddingBlock,
        paddingBottom: paddingBlock,
        paddingLeft: paddingInline,
        paddingRight: paddingInline,
        ':active': {
          ...ObjectBoxColors.boxPressed,
          paddingBottom: paddingInline - 2,
          paddingLeft: paddingBlock + 2,
          paddingRight: paddingBlock - 2,
          paddingTop: paddingInline + 2,
        },
        ...ObjectBoxShapes.square,
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
}
