import { CSSObject } from '@emotion/core';
import { FlexDirectionProperty } from 'csstype';

export const Scale = 2;

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
  block,
  inline,
}

export const FlowValues: Record<Flows, FlexDirectionProperty> = {
  [Flows.block]: 'column',
  [Flows.inline]: 'row',
};

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
      inset -${Scale / 2}px -${Scale / 2}px 0 ${Scale / 2}px
        var(--bottom-outer-color),
      inset 0 0 0 ${Scale}px var(--top-outer-color),
      inset -${Scale / 2}px -${Scale / 2}px 0 3px var(--bottom-inner-color),
      inset 0 0 0 ${Scale * 2}px var(--top-inner-color);
    `,
  },
  roundedTab: {
    backgroundColor: 'var(--background-color)',
    boxShadow: `
      0 -{${Scale * 3}}px 0 -${Scale * 2}px var(--top-inner-color),
      0 -${Scale * 4}px 0 -${Scale * 2}px var(--top-outer-color),
      -${Scale}px -{${Scale * 3}}px 0 -${Scale * 2}px var(--top-outer-color),
      ${Scale}px -{${Scale * 3}}px 0 -${Scale * 2}px var(--bottom-outer-color),
      inset ${Scale}px 0 0 0 var(--top-outer-color),
      inset ${Scale * 2}px 0 0 0 var(--top-inner-color),
      inset -${Scale}px 0 0 0 var(--bottom-outer-color),
      inset -${Scale * 2}px 0 0 0 var(--bottom-inner-color);
    `,
  },
};

export enum Paddings {
  box,
  large,
  medium,
  none,
  small,
}

export const PaddingValues = {
  [Paddings.box]: 3 * Scale,
  [Paddings.large]: 6 * Scale,
  [Paddings.medium]: 3 * Scale,
  [Paddings.none]: 0,
  [Paddings.small]: 1 * Scale,
};
