import { CSSObject } from '@emotion/core';

export enum Alignments {
  /** A guide marking the bottom edge of the view. */
  bottom,

  /** A guide marking the bottom and leading edges of the view. */
  bottomLeading,

  /** A guide marking the bottom and trailing edges of the view. */
  bottomTrailing,

  /** A guide marking the center of the view. */
  center,

  /** A guide marking the leading edge of the view. */
  leading,

  /** A guide marking the top edge of the view. */
  top,

  /** A guide marking the top and leading edges of the view. */
  topLeading,

  /** A guide marking the top and trailing edges of the view. */
  topTrailing,

  /** A guide marking the trailing edge of the view. */
  trailing,
}

export enum HorizontalAlignments {
  /** A guide marking the horizontal center of the view. */
  center,

  /** A guide marking the leading edge of the view. */
  leading,

  /** A guide marking the trailing edge of the view. */
  trailing,
}

export enum SelectionModes {
  /** Allows user selection of text. */
  allow,

  /** Prevents user selection of text. */
  prevent,
}

export enum TextAlignments {
  /** Center text horizontally on the parent view. */
  center,

  /** Align text to the leading edge of the view. */
  leading,

  /** Align text to the trailing edge of the view. */
  trailing,
}

export enum TruncationModes {
  /**
   * Truncates to the available length of the parent view, without adding
   * ellipsis.
   */
  crop,

  /** Truncates the trailing part of the text, adding ellipsis to the end. */
  tail,
}

export enum VerticalAlignments {
  /** A guide marking the bottom edge of the view. */
  bottom,

  /** A guide marking the vertical center of the view. */
  center,

  /** A guide marking the top edge of the view. */
  top,
}

export interface ViewLayoutProps {
  /**
   * Sets the background color that the view uses.
   */
  backgroundColor?: string;

  /**
   * Margin applied to all sides of the view.
   */
  margin?: number;

  /**
   * Margin applied to the leading side of the view.
   */
  marginLeading?: number;

  /**
   * Margin applied to the of top side the view.
   */
  marginTop?: number;

  /**
   * Margin applied to the trailing side of the view.
   */
  marginTrailing?: number;

  /**
   * Margin applied to the bottom side of the view.
   */
  marginBottom?: number;

  /**
   * Padding applied to all sides of the view.
   */
  padding?: number;

  /**
   * Padding applied to the leading side of the view.
   */
  paddingLeading?: number;

  /**
   * Padding applied to the of top side the view.
   */
  paddingTop?: number;

  /**
   * Padding applied to the trailing side of the view.
   */
  paddingTrailing?: number;

  /**
   * Padding applied to the bottom side of the view.
   */
  paddingBottom?: number;
}

export interface ViewStyleProps {
  /**
   * Sets the default font family for text in the view.
   */
  fontFamily?: string;

  /**
   * Sets the font size of the text.
   */
  fontSize?: number;

  /**
   * Color applied to the text content.
   */
  foregroundColor?: string;

  /**
   * Sets the amount of space between lines of text in the view.
   */
  lineSpacing?: number;
}

export function spreadLayoutPropsToCss({
  backgroundColor,
  margin,
  marginLeading,
  marginTop,
  marginTrailing,
  marginBottom,
  padding,
  paddingLeading,
  paddingTop,
  paddingTrailing,
  paddingBottom,
}: ViewLayoutProps): CSSObject {
  return {
    backgroundColor,
    margin,
    marginLeft: marginLeading,
    marginTop,
    marginRight: marginTrailing,
    marginBottom,
    padding,
    paddingLeft: paddingLeading,
    paddingTop,
    paddingRight: paddingTrailing,
    paddingBottom,
  };
}

export function spreadStylePropsToCss({
  fontFamily,
  fontSize,
  foregroundColor,
  lineSpacing,
}: ViewStyleProps): CSSObject {
  return {
    fontFamily,
    fontSize,
    color: foregroundColor,
    lineSpacing,
  };
}
