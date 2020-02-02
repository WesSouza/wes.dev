/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import {
  spreadLayoutPropsToCss,
  spreadStylePropsToCss,
  VerticalAlignments,
  ViewLayoutProps,
  ViewStyleProps,
} from './View';

const AlignmentMap: Record<VerticalAlignments, string> = {
  [VerticalAlignments.bottom]: 'flex-end',
  [VerticalAlignments.center]: 'center',
  [VerticalAlignments.top]: 'flex-start',
};

interface Props extends ViewLayoutProps, ViewStyleProps {
  /**
   * The guide for aligning the subviews in this stack. It has the same
   * vertical screen coordinate for all children.
   */
  alignment?: VerticalAlignments;

  /**
   * The subviews children of this stack.
   */
  children: ReactNode;

  /**
   * The distance between adjacent subviews.
   */
  spacing?: number;
}

/**
 * A view that arranges its children in a horizontal line.
 */
export function HStack({
  alignment = VerticalAlignments.center,
  children,
  spacing,
  ...restProps
}: Props) {
  return (
    <div
      css={{
        ...spreadLayoutPropsToCss(restProps),
        ...spreadStylePropsToCss(restProps),
        display: 'flex',
        flexDirection: 'row',
        alignItems: AlignmentMap[alignment],
        '> *:not(:last-child)': {
          marginRight: spacing,
        },
      }}
    >
      {children}
    </div>
  );
}
