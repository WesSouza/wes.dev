/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { FormEvent, RefObject } from 'react';

import {
  spreadAccessibilityPropsToAttributes,
  spreadLayoutPropsToCss,
  spreadNativeLayoutPropsToCss,
  spreadStylePropsToCss,
  ViewProps,
} from './View';

interface Props extends ViewProps {
  /**
   * Do not use.
   */
  UNSTABLE_css?: CSSObject;

  /**
   * The subviews' content value.
   */
  value?: string;
}

interface InputProps {
  /**
   * A single line editable, or multi line editable.
   */
  multiLine: false;

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
}

interface TextAreaProps {
  /**
   * A single line editable, or multi line editable.
   */
  multiLine: true;

  /**
   * Reference to the native HTML element.
   */
  nativeRef?: RefObject<HTMLTextAreaElement>;

  /**
   * Focus event handler, called when the element receives focus.
   */
  onFocus?: (event: FormEvent<HTMLTextAreaElement>) => void;

  /**
   * Blur event handler, called when the element loses focus.
   */
  onBlur?: (event: FormEvent<HTMLTextAreaElement>) => void;

  /**
   * Change event handler, called when changes are committed.
   */
  onChange?: (event: FormEvent<HTMLTextAreaElement>) => void;

  /**
   * Text input event handler, called after each change in the content.
   */
  onInput?: (event: FormEvent<HTMLTextAreaElement>) => void;
}

/**
 * A view that arranges its value in a vertical line.
 */
export function ContentEditable(props: Props & (InputProps | TextAreaProps)) {
  const { UNSTABLE_css, value } = props;

  const css: CSSObject = {
    background: 'none',
    border: 0,
    display: 'block',
    fontFamily: 'PerfectDOS',
    fontSize: '22px',
    margin: 0,
    padding: 0,
    appearance: 'none',
    borderRadius: 0,
    ':focus': {
      outline: 0,
    },
    ...spreadLayoutPropsToCss(props),
    ...spreadStylePropsToCss(props),
    ...UNSTABLE_css,
  };

  if (props.multiLine) {
    const { nativeRef, onBlur, onChange, onFocus, onInput } = props;
    return (
      <textarea
        css={css}
        defaultValue={value}
        ref={nativeRef}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onInput={onInput}
        style={spreadNativeLayoutPropsToCss(props)}
        {...spreadAccessibilityPropsToAttributes(props)}
      />
    );
  }

  const { nativeRef, onBlur, onChange, onFocus, onInput } = props;
  return (
    <input
      css={css}
      defaultValue={value}
      ref={nativeRef}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      onInput={onInput}
      style={spreadNativeLayoutPropsToCss(props)}
      {...spreadAccessibilityPropsToAttributes(props)}
    />
  );
}
