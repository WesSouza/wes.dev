/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { MouseEvent, ReactNode } from 'react';

import {
  spreadLayoutPropsToCss,
  spreadStylePropsToCss,
  ViewLayoutProps,
  ViewStyleProps,
} from './View';

interface Props extends ViewLayoutProps, ViewStyleProps {
  /**
   * The subviews children of this touchable view.
   */
  children: ReactNode;

  /**
   * Callback for the press event.
   */
  onPress?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the pressdown event.
   */
  onPressDown?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the pressup event.
   */
  onPressUp?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Internal raw CSS, only intended to be used by library developers.
   */
  UNSTABLE_css: CSSObject;
}

/**
 * A view that arranges its children in a vertical line.
 */
export function Pressable({
  children,
  onPress,
  onPressDown,
  onPressUp,
  UNSTABLE_css,
  ...props
}: Props) {
  return (
    <button
      css={{
        display: 'block',
        border: 0,
        margin: 0,
        padding: 0,
        background: 'none',
        ...spreadLayoutPropsToCss(props),
        ...spreadStylePropsToCss(props),
        ...UNSTABLE_css,
      }}
      onClick={onPress}
      onMouseDown={onPressDown}
      onMouseUp={onPressUp}
    >
      {children}
    </button>
  );
}
