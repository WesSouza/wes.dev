import { CSSObject } from '@emotion/core';

export const Colors = {
  black: '#000000',
  blue: '#000B76',
  darkGray: '#7B7D7B',
  gray: '#BEBDBE',
  lightGray: '#DEDEDE',
  teal: '#347B7A',
  white: '#FFFFFF',
};

export enum Flows {
  block = 'column',
  inline = 'row',
}

export const ObjectBoxColors: Record<string, CSSObject> = {
  box: {
    '--top-outer-color': Colors.white,
    '--top-inner-color': Colors.lightGray,
    '--bottom-inner-color': Colors.darkGray,
    '--bottom-outer-color': Colors.black,
    '--background-color': Colors.gray,
  },
  boxPressed: {
    '--top-outer-color': Colors.black,
    '--top-inner-color': Colors.darkGray,
    '--bottom-inner-color': Colors.lightGray,
    '--bottom-outer-color': Colors.white,
    '--background-color': Colors.gray,
  },
  frame: {
    '--top-outer-color': Colors.darkGray,
    '--top-inner-color': Colors.black,
    '--bottom-inner-color': Colors.lightGray,
    '--bottom-outer-color': Colors.white,
    '--background-color': Colors.white,
  },
  window: {
    '--top-outer-color': Colors.lightGray,
    '--top-inner-color': Colors.white,
    '--bottom-inner-color': Colors.darkGray,
    '--bottom-outer-color': Colors.black,
    '--background-color': Colors.gray,
  },
};

export const ObjectBoxShapes: Record<string, CSSObject> = {
  square: {
    backgroundColor: 'var(--background-color)',
    boxShadow: `
      inset -1px -1px 0 1px var(--bottom-outer-color),
      inset 0 0 0 2px var(--top-outer-color),
      inset -1px -1px 0 3px var(--bottom-inner-color),
      inset 0 0 0 4px var(--top-inner-color);
    `,
  },
  rounded: {
    backgroundColor: 'var(--background-color)',
    boxShadow: `
      0 -2px 0 0 var(--top-inner-color),
      -2px 0 0 0 var(--top-inner-color),
      0 -4px 0 0 var(--top-outer-color),
      -4px 0 0 0 var(--top-outer-color),
      -2px -2px 0 0 var(--top-outer-color),
      1px -1px 0 1px var(--bottom-inner-color),
      0 2px 0 0 var(--bottom-inner-color),
      4px 0 0 0 var(--bottom-outer-color),
      2px 2px 0 0 var(--bottom-outer-color),
      -2px 2px 0 0 var(--background-color),
      0 4px 0 0 var(--bottom-outer-color);
    `,
  },
};

export enum Paddings {
  large = 'large',
  medium = 'medium',
  none = 'none',
  small = 'small',
}

export const PaddingValues = {
  large: 12,
  medium: 6,
  small: 2,
  none: 0,
};
