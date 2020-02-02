import { CSSObject } from '@emotion/core';
import { HTMLAttributes, CSSProperties } from 'react';

import { Themes, ThemeStyles } from './Themes';

export enum Alignments {
  /** A guide marking the bottom edge of the view. */
  bottom = 'bottom',

  /** A guide marking the bottom and leading edges of the view. */
  bottomLeading = 'bottomLeading',

  /** A guide marking the bottom and trailing edges of the view. */
  bottomTrailing = 'bottomTrailing',

  /** A guide marking the center of the view. */
  center = 'center',

  /** A guide marking the leading edge of the view. */
  leading = 'leading',

  /** A guide marking the top edge of the view. */
  top = 'top',

  /** A guide marking the top and leading edges of the view. */
  topLeading = 'topLeading',

  /** A guide marking the top and trailing edges of the view. */
  topTrailing = 'topTrailing',

  /** A guide marking the trailing edge of the view. */
  trailing = 'trailing',
}

export enum Cursors {
  eResize = 'e-resize',
  ewResize = 'ew-resize',
  neResize = 'ne-resize',
  neswResize = 'nesw-resize',
  nResize = 'n-resize',
  nsResize = 'ns-resize',
  nwResize = 'nw-resize',
  nwseResize = 'nwse-resize',
  pointer = 'p-ointer',
  seResize = 'se-resize',
  sResize = 's-resize',
  swResize = 'sw-resize',
  wResize = 'w-resize',
}

export enum HorizontalAlignments {
  /** A guide marking the horizontal center of the view. */
  center = 'center',

  /** A guide marking the leading edge of the view. */
  leading = 'flex-start',

  /** Stretches the content vertically. */
  stretch = 'stretch',

  /** A guide marking the trailing edge of the view. */
  trailing = 'flex-end',
}

export enum SelectionModes {
  /** Allows user selection of text. */
  allow = 'allow',

  /** Prevents user selection of text. */
  prevent = 'prevent',
}

export enum TextAlignments {
  /** Center text horizontally on the parent view. */
  center = 'center',

  /** Align text to the leading edge of the view. */
  leading = 'leading',

  /** Align text to the trailing edge of the view. */
  trailing = 'trailing',
}

export enum TruncationModes {
  /**
   * Truncates to the available length of the parent view, without adding
   * ellipsis.
   */
  crop = 'crop',

  /** Truncates the trailing part of the text, adding ellipsis to the end. */
  tail = 'tail',
}

export enum VerticalAlignments {
  /** A guide marking the bottom edge of the view. */
  bottom = 'flex-end',

  /** A guide marking the vertical center of the view. */
  center = 'center',

  /** Stretches the content horizontally. */
  stretch = 'stretch',

  /** A guide marking the top edge of the view. */
  top = 'flex-start',
}

export interface ViewAccessibilityProps {
  /**
   * Indicates the view can receive focus.
   */
  focusable?: boolean;

  /**
   * Provides a label for screen readers.
   */
  label?: string;

  /**
   * Provides the element role for screen readers.
   */
  role?: string;
}

export interface ViewLayoutProps {
  /**
   * Sets the background color that the view uses.
   */
  backgroundColor?: string;

  /**
   * Sets the proportion the view grows to.
   *
   * Defaults to 0.
   */
  grow?: number;

  /**
   * Makes view invisible and not interactive, but able to render.
   */
  invisible?: boolean;

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
   * View opacity percentage.
   */
  opacity?: number;

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

  /**
   * Alignment of the view relative to the parent view stack.
   */
  selfAlignment?: HorizontalAlignments | VerticalAlignments;

  /**
   * Sets the proportion the view shrinks to, if needed.
   *
   * Defaults to 1.
   */
  shrink?: number;

  /**
   * Theme to apply to this view.
   */
  theme?: Themes;

  /**
   * Allows sub-view content to overflow on x axis, with scrolling.
   */
  xScroll?: boolean;

  /**
   * Allows sub-view content to overflow on y axis, with scrolling.
   */
  yScroll?: boolean;
}

export interface ViewNativeStyleProps {
  /**
   * Position the view starting from the right.
   */
  invertX?: boolean;

  /**
   * Position the view starting from the bottom.
   */
  invertY?: boolean;

  /**
   * Sets the view height.
   */
  height?: string | number;

  /**
   * Indicates the sub-views will be positioned relative to this view.
   */
  relative?: boolean;

  /**
   * Sets the view width.
   */
  width?: string | number;

  /**
   * Sets the view X position.
   */
  x?: number;

  /**
   * Sets the view Y position.
   */
  y?: number;

  /**
   * Sets the order of the view among other sibling absolutely positioned views.
   */
  zIndex?: number;
}

export interface ViewStyleProps {
  /**
   * Defines the cursor that is displayed for this view.
   */
  cursor?: Cursors;

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

export type ViewProps = ViewAccessibilityProps &
  ViewLayoutProps &
  ViewNativeStyleProps &
  ViewStyleProps;

export function spreadLayoutPropsToCss({
  backgroundColor,
  grow,
  invisible,
  margin,
  marginBottom,
  marginLeading,
  marginTop,
  marginTrailing,
  opacity,
  padding,
  paddingBottom,
  paddingLeading,
  paddingTop,
  paddingTrailing,
  selfAlignment,
  shrink,
  theme,
  xScroll,
  yScroll,
}: ViewLayoutProps): CSSObject {
  const css: CSSObject = {};

  if (backgroundColor !== undefined) {
    css.backgroundColor = backgroundColor;
  }

  if (grow !== undefined) {
    css.flexGrow = grow;
  }

  if (invisible) {
    css.opacity = 0;
    css.pointerEvents = 'none';
  }

  if (margin !== undefined) {
    css.margin = margin;
  }

  if (marginBottom !== undefined) {
    css.marginBottom = marginBottom;
  }

  if (marginLeading !== undefined) {
    css.marginLeft = marginLeading;
  }

  if (marginTrailing !== undefined) {
    css.marginRight = marginTrailing;
  }

  if (marginTop !== undefined) {
    css.marginTop = marginTop;
  }

  if (opacity !== undefined) {
    css.opacity = opacity;
  }

  if (padding !== undefined) {
    css.padding = padding;
  }

  if (paddingBottom !== undefined) {
    css.paddingBottom = paddingBottom;
  }

  if (paddingLeading !== undefined) {
    css.paddingLeft = paddingLeading;
  }

  if (paddingTrailing !== undefined) {
    css.paddingRight = paddingTrailing;
  }

  if (paddingTop !== undefined) {
    css.paddingTop = paddingTop;
  }

  if (selfAlignment !== undefined) {
    css.alignSelf = selfAlignment;
  }

  if (shrink !== undefined) {
    css.flexShrink = shrink;
  }

  if (xScroll && yScroll) {
    css.overflow = 'scroll';
  } else if (xScroll) {
    css.overflowX = 'scroll';
  } else if (yScroll) {
    css.overflowY = 'scroll';
  }

  return {
    ...(theme ? { ...ThemeStyles[theme] } : null),
    ...css,
  };
}

export function spreadNativeLayoutPropsToCss({
  invertX,
  invertY,
  height,
  relative,
  width,
  x,
  y,
  zIndex,
}: ViewNativeStyleProps): CSSProperties {
  const css: CSSProperties = {};

  if (height !== undefined) {
    css.height = height;
  }

  if (x !== undefined) {
    if (!invertX) {
      css.left = x;
    } else {
      css.right = x;
    }
  }

  if (x !== undefined && y !== undefined) {
    css.position = 'absolute';
  } else if (relative) {
    css.position = 'relative';
  }

  if (y !== undefined) {
    if (!invertY) {
      css.top = y;
    } else {
      css.bottom = y;
    }
  }

  if (width !== undefined) {
    css.width = width;
  }

  if (zIndex !== undefined) {
    css.zIndex = zIndex;
  }

  return css;
}

export function spreadStylePropsToCss({
  cursor,
  fontFamily,
  fontSize,
  foregroundColor,
  lineSpacing,
}: ViewStyleProps): CSSObject {
  const css: CSSObject = {};

  if (cursor !== undefined) {
    css.cursor = cursor;
  }

  if (fontFamily !== undefined) {
    css.fontFamily = fontFamily;
  }

  if (fontSize !== undefined) {
    css.fontSize = fontSize;
  }

  if (foregroundColor !== undefined) {
    css.color = foregroundColor;
  }

  if (lineSpacing !== undefined) {
    css.lineHeight = lineSpacing;
  }

  return css;
}

export function spreadAccessibilityPropsToAttributes<T>({
  focusable,
  label,
  role,
}: ViewAccessibilityProps): HTMLAttributes<T> {
  const attributes: HTMLAttributes<T> = {};

  if (focusable !== undefined) {
    attributes.tabIndex = 0;
  }

  if (label !== undefined) {
    attributes['aria-label'] = label;
  }

  if (role !== undefined) {
    attributes['aria-roledescription'] = role;
  }

  return attributes;
}
