/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { MouseEvent, ReactNode, RefObject, TouchEvent } from 'react';

import {
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  spreadNativeLayoutPropsToCss,
  spreadStylePropsToCss,
  ViewProps,
} from './View';

interface Props extends ViewProps {
  /**
   * The subviews children of this touchable view.
   */
  children?: ReactNode;

  /**
   * Reference to the native HTML element.
   */
  nativeRef?: RefObject<HTMLButtonElement>;

  /**
   * Callback for the double press event.
   */
  onContextMenu?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the double press event.
   */
  onDoublePress?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the pointer enter event.
   */
  onPointerEnter?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the pointer leave event.
   */
  onPointerLeave?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the press event.
   */
  onPress?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Callback for the pressdown event.
   */
  onPressDown?: (
    event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>,
  ) => void;
}

/**
 * A view that arranges its children in a vertical line.
 */
export function Pressable({
  children,
  nativeRef,
  onContextMenu,
  onDoublePress,
  onPointerEnter,
  onPointerLeave,
  onPress,
  onPressDown,
  ...props
}: Props) {
  const css: CSSObject = {
    background: 'none',
    border: 0,
    display: 'block',
    //margin: 0,
    padding: 0,
    userSelect: 'none',
    ':focus': {
      outline: 0,
    },
    ...spreadLayoutPropsToCss(props),
    ...spreadStylePropsToCss(props),
  };

  return (
    <button
      css={css}
      ref={nativeRef}
      onClick={onPress}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoublePress}
      onMouseDown={onPressDown}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onTouchStart={onPressDown}
      style={spreadNativeLayoutPropsToCss(props)}
      {...spreadAccessibilityPropsToAttributes(props)}
    >
      {children}
    </button>
  );
}
