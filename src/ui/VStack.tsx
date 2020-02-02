/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { ReactNode, RefObject } from 'react';

import {
  HorizontalAlignments,
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  spreadNativeLayoutPropsToCss,
  spreadStylePropsToCss,
  ViewProps,
} from './View';

const AlignmentMap: Record<HorizontalAlignments, string> = {
  [HorizontalAlignments.leading]: 'flex-start',
  [HorizontalAlignments.center]: 'center',
  [HorizontalAlignments.stretch]: 'stretch',
  [HorizontalAlignments.trailing]: 'flex-end',
};

export interface VStackProps extends ViewProps {
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
   * Reference to the native HTML element.
   */
  nativeRef?: RefObject<HTMLDivElement>;

  /**
   * The distance between adjacent subviews.
   */
  spacing?: number;

  /**
   * Do not use.
   */
  UNSTABLE_css?: CSSObject;

  /**
   * Do not use.
   */
  UNSTABLE_onPressDown?: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => void;
}

/**
 * A view that arranges its children in a vertical line.
 */
export function VStack({
  alignment = HorizontalAlignments.center,
  children,
  nativeRef,
  spacing,
  UNSTABLE_css,
  UNSTABLE_onPressDown,
  ...props
}: VStackProps) {
  return (
    <div
      css={{
        ...spreadLayoutPropsToCss(props),
        ...spreadStylePropsToCss(props),
        display: 'flex',
        flexDirection: 'column',
        alignItems: AlignmentMap[alignment],
        '> *:not(:last-child)': {
          marginBottom: spacing,
        },
        ...UNSTABLE_css,
      }}
      ref={nativeRef}
      onMouseDown={UNSTABLE_onPressDown}
      onTouchStart={UNSTABLE_onPressDown}
      style={spreadNativeLayoutPropsToCss(props)}
      {...spreadAccessibilityPropsToAttributes(props)}
    >
      {children}
    </div>
  );
}
