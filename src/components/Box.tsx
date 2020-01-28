/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import {
  Colors,
  Paddings,
  PaddingValues,
  ObjectBoxColors,
  ObjectBoxShapes,
} from '~/constants/Styles';
import { propsToCss, RenderingProps } from '~/utils/rendering';

const PaddingsMatrix: Record<Paddings, [number, number]> = {
  [Paddings.large]: [PaddingValues.medium, PaddingValues.large],
  [Paddings.medium]: [PaddingValues.medium, PaddingValues.medium],
  [Paddings.small]: [PaddingValues.small, PaddingValues.small],
  [Paddings.none]: [PaddingValues.none, PaddingValues.none],
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

  const paddingInline = PaddingsMatrix[padding][1] + 6;
  const paddingBlock = PaddingsMatrix[padding][0] + 6;

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
