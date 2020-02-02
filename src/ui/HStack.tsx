/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { ReactNode, RefObject } from 'react';

import {
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  spreadNativeLayoutPropsToCss,
  spreadStylePropsToCss,
  VerticalAlignments,
  ViewProps,
} from './View';

const AlignmentMap: Record<VerticalAlignments, string> = {
  [VerticalAlignments.bottom]: 'flex-end',
  [VerticalAlignments.center]: 'center',
  [VerticalAlignments.stretch]: 'stretch',
  [VerticalAlignments.top]: 'flex-start',
};

export interface HStackProps extends ViewProps {
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
   * Reference to the native HTML element.
   */
  nativeRef?: RefObject<HTMLDivElement>;

  /**
   * The distance between adjacent subviews.
   */
  spacing?: number;

  /**
   * Controls wrapping of subviews.
   */
  wrap?: boolean;

  /**
   * Do not use.
   */
  UNSTABLE_css?: CSSObject;

  /**
   * Do not use.
   */
  UNSTABLE_onClick?: () => void;
}

/**
 * A view that arranges its children in a horizontal line.
 */
export function HStack({
  alignment = VerticalAlignments.center,
  children,
  nativeRef,
  spacing,
  UNSTABLE_css,
  UNSTABLE_onClick,
  wrap,
  ...props
}: HStackProps) {
  return (
    <div
      css={{
        ...spreadLayoutPropsToCss(props),
        ...spreadStylePropsToCss(props),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: wrap ? 'wrap' : undefined,
        alignItems: AlignmentMap[alignment],
        '> *:not(:last-child)': {
          marginRight: spacing,
        },
        ...UNSTABLE_css,
      }}
      ref={nativeRef}
      onClick={UNSTABLE_onClick}
      style={spreadNativeLayoutPropsToCss(props)}
      {...spreadAccessibilityPropsToAttributes(props)}
    >
      {children}
    </div>
  );
}
