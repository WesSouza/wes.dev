/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import {
  Colors,
  ObjectBoxColors,
  ObjectBoxShapes,
  Paddings,
  PaddingValues,
} from '~/constants/Styles';
import { propsToCss, RenderingProps } from '~/utils/rendering';

const PaddingsMatrix: Record<Paddings, [number, number]> = {
  [Paddings.box]: [PaddingValues[Paddings.box], PaddingValues[Paddings.box]],
  [Paddings.large]: [
    PaddingValues[Paddings.large],
    PaddingValues[Paddings.large],
  ],
  [Paddings.none]: [PaddingValues[Paddings.none], PaddingValues[Paddings.none]],
  [Paddings.medium]: [
    PaddingValues[Paddings.medium],
    PaddingValues[Paddings.medium],
  ],
  [Paddings.small]: [
    PaddingValues[Paddings.small],
    PaddingValues[Paddings.small],
  ],
};

export enum BoxTypes {
  'box',
  'frame',
  'window',
}

export interface BoxProps extends RenderingProps {
  children?: ReactNode;
  padding?: Paddings;
}

interface Props extends BoxProps {
  type?: BoxTypes;
}

export function Box({
  children,
  type = BoxTypes.box,
  padding = Paddings.none,
  ...renderingProps
}: Props) {
  const isFrame = type === BoxTypes.frame;
  const isWindow = type === BoxTypes.window;

  const paddingInline =
    PaddingsMatrix[padding][1] + PaddingValues[Paddings.box];
  const paddingBlock = PaddingsMatrix[padding][0] + PaddingValues[Paddings.box];

  return (
    <div
      css={{
        ...propsToCss(renderingProps),
        display: 'flex',
        paddingTop: paddingBlock,
        paddingBottom: paddingBlock,
        paddingLeft: paddingInline,
        paddingRight: paddingInline,
        backgroundColor: isFrame ? Colors.white : Colors.gray,
        ...ObjectBoxShapes.square,
        ...(isFrame
          ? ObjectBoxColors.frame
          : isWindow
          ? ObjectBoxColors.window
          : ObjectBoxColors.box),
      }}
    >
      {children}
    </div>
  );
}
