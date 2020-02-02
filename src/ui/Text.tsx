/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FontWeightProperty } from 'csstype';
import { ReactNode } from 'react';

import {
  SelectionModes,
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  spreadNativeLayoutPropsToCss,
  spreadStylePropsToCss,
  TextAlignments,
  TruncationModes,
  ViewProps,
} from './View';

const AlignmentMap: Record<TextAlignments, string> = {
  [TextAlignments.center]: 'center',
  [TextAlignments.leading]: 'left',
  [TextAlignments.trailing]: 'right',
};

interface Props extends ViewProps {
  /**
   * Applies a bold font weight to the text.
   */
  bold?: boolean;

  /**
   * Text content, or array of text content.
   */
  children: ReactNode;

  /**
   * Sets the font weight of the text.
   */
  fontWeight?: FontWeightProperty;

  /**
   * Applies italics to the text.
   */
  italic?: boolean;

  /**
   * Alignment applied to multiline text.
   */
  multilineTextAlignment?: TextAlignments;

  /**
   * Sets the selection mode to determine if selecting text is available.
   */
  selectionMode?: SelectionModes;

  /**
   * Sets the truncation mode for lines of text that are too long to fit in the
   * available space.
   */
  truncationMode?: TruncationModes;

  /**
   * Applies an underline to the text.
   */
  underline?: boolean;

  /**
   * Color applied to the underline.
   */
  underlineColor?: string;
}

/**
 * A view that displays one or more lines of read-only text.
 */
export function Text({
  bold,
  children,
  fontWeight,
  italic,
  multilineTextAlignment,
  selectionMode,
  truncationMode,
  underline,
  underlineColor,
  ...props
}: Props) {
  return (
    <span
      css={{
        ...spreadLayoutPropsToCss(props),
        ...spreadStylePropsToCss(props),
        align: multilineTextAlignment
          ? AlignmentMap[multilineTextAlignment]
          : undefined,
        fontWeight: fontWeight ?? bold ? 'bold' : undefined,
        fontStyle: italic ? 'italics' : undefined,
        textDecoration: underline ? 'underline' : undefined,
        textDecorationColor: underlineColor,
        ...(selectionMode === SelectionModes.allow
          ? undefined
          : {
              cursor: 'default',
              userSelect: 'none',
            }),
        ...(truncationMode === TruncationModes.crop
          ? {
              overflow: 'hidden',
            }
          : truncationMode === TruncationModes.tail
          ? {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }
          : undefined),
      }}
      style={spreadNativeLayoutPropsToCss(props)}
      {...spreadAccessibilityPropsToAttributes(props)}
    >
      {children}
    </span>
  );
}
