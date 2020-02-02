/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import {
  HorizontalAlignments,
  spreadLayoutPropsToCss,
  spreadStylePropsToCss,
  ViewLayoutProps,
  ViewStyleProps,
} from './View';

const AlignmentMap: Record<HorizontalAlignments, string> = {
  [HorizontalAlignments.leading]: 'flex-start',
  [HorizontalAlignments.center]: 'center',
  [HorizontalAlignments.trailing]: 'flex-end',
};

interface Props extends ViewLayoutProps, ViewStyleProps {
  /**
   * The guide for aligning the subviews in this stack. It has the same
   * horizontal screen coordinate for all children.
   */
  alignment?: HorizontalAlignments;

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
 * A view that arranges its children in a vertical line.
 */
export function VStack({
  alignment = HorizontalAlignments.center,
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
        flexDirection: 'column',
        alignItems: AlignmentMap[alignment],
        '> *:not(:last-child)': {
          marginBottom: spacing,
        },
      }}
    >
      {children}
    </div>
  );
}
