/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';
import useBoolean from 'react-hanger/useBoolean';

import { ObjectBoxColors, ObjectBoxShapes } from '~/constants/Styles';
import { propsToCss, RenderingProps } from '~/utils/rendering';

interface Props extends RenderingProps {
  children?: ReactNode;
  onPress?: () => {};
  onPressDown?: () => {};
  onPressUp?: () => {};
}

export function Button({
  children,
  onPress,
  onPressDown,
  onPressUp,
  ...renderingProps
}: Props) {
  const isPressed = useBoolean(false);

  const paddingInline = 6;
  const paddingBlock = 6;

  return (
    <button
      css={{
        ...propsToCss(renderingProps),
        ...(isPressed.value
          ? {
              ...ObjectBoxColors.boxPressed,
              paddingBottom: paddingInline - 2,
              paddingLeft: paddingBlock + 2,
              paddingRight: paddingBlock - 2,
              paddingTop: paddingInline + 2,
            }
          : {
              ...ObjectBoxColors.box,
              paddingTop: paddingBlock,
              paddingBottom: paddingBlock,
              paddingLeft: paddingInline,
              paddingRight: paddingInline,
            }),
        ...ObjectBoxShapes.square,
        display: 'flex',
        margin: 0,
        border: 0,
      }}
      onMouseDown={isPressed.setTrue}
      onMouseUp={isPressed.setFalse}
    >
      {children}
    </button>
  );
}
