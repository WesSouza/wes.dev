/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { FormEvent, RefObject } from 'react';

import { Scale } from '~/constants/Styles';

import { Themes, ThemeStyles } from './Themes';
import {
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  spreadNativeLayoutPropsToCss,
  spreadStylePropsToCss,
  ViewProps,
} from './View';

interface Props extends ViewProps {
  /**
   * The maximum value in the range.
   */
  max?: number;

  /**
   * The minimum value in the range.
   */
  min?: number;

  /**
   * Reference to the native HTML element.
   */
  nativeRef?: RefObject<HTMLInputElement>;

  /**
   * Focus event handler, called when the element receives focus.
   */
  onFocus?: (event: FormEvent<HTMLInputElement>) => void;

  /**
   * Blur event handler, called when the element loses focus.
   */
  onBlur?: (event: FormEvent<HTMLInputElement>) => void;

  /**
   * Change event handler, called when changes are committed.
   */
  onChange?: (event: FormEvent<HTMLInputElement>) => void;

  /**
   * Text input event handler, called after each change in the content.
   */
  onInput?: (event: FormEvent<HTMLInputElement>) => void;

  /**
   * Do not use.
   */
  UNSTABLE_css?: CSSObject;

  /**
   * The current range value.
   */
  value?: number;
}

/**
 * A view that arranges its value in a vertical line.
 */
export function Range({
  UNSTABLE_css,
  min,
  max,
  nativeRef,
  value,
  onBlur,
  onChange,
  onFocus,
  onInput,
  ...props
}: Props) {
  const buttonCss = ThemeStyles[Themes.button];
  const frameInsetCss = ThemeStyles[Themes.frameInset];

  const thumbCss: CSSObject = {
    appearance: 'none',
    marginTop: Scale * -10,
    width: Scale * 8,
    height: Scale * 20,
    ...buttonCss,
  };
  const trackCss: CSSObject = {
    appearance: 'none',
    height: Scale * 4,
    ...frameInsetCss,
  };

  const css: CSSObject = {
    appearance: 'none',
    width: '100%',
    height: Scale * 20,
    background: 'none',
    '::-webkit-slider-thumb': thumbCss,
    '::-webkit-slider-runnable-track': trackCss,
    '::-moz-range-thumb': thumbCss,
    '::-moz-range-track': trackCss,
    ...spreadLayoutPropsToCss(props),
    ...spreadStylePropsToCss(props),
    ...UNSTABLE_css,
  };

  return (
    <input
      css={css}
      defaultValue={value}
      min={min}
      max={max}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      onInput={onInput}
      ref={nativeRef}
      style={spreadNativeLayoutPropsToCss(props)}
      type="range"
      {...spreadAccessibilityPropsToAttributes(props)}
    />
  );
}
