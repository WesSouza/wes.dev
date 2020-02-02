/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import { ObjectBoxColors, ObjectBoxShapes } from '~/constants/Styles';
import { propsToCss, RenderingProps } from '~/utils/rendering';

interface Props extends RenderingProps {
  children?: ReactNode;
  onPress?: () => {};
  onPressDown?: () => {};
  onPressUp?: () => {};
}

export function Tab({
  children,
  onPress,
  onPressDown,
  onPressUp,
  ...renderingProps
}: Props) {
  const paddingInline = 6;
  const paddingBlock = 6;

  return (
    <button
      css={{
        ...propsToCss(renderingProps),
        ...ObjectBoxColors.box,
        ...ObjectBoxShapes.roundedTab,
        paddingTop: paddingBlock,
        paddingBottom: paddingBlock,
        paddingLeft: paddingInline,
        paddingRight: paddingInline,
        display: 'flex',
        margin: 0,
        border: 0,
      }}
    >
      {children}
    </button>
  );
}
