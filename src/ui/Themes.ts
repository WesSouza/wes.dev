import { CSSObject } from '@emotion/core';

import { Colors, Scale } from '~/constants/Styles';

const BorderImages = {
  button: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23BDBEBD' d='M0 0h10v10H0z'/%3E%3Cpath d='M0 0v8h2V2h6V0H0z' fill='%23fff'/%3E%3Cpath d='M6 2H2v4h2V4h2V2z' fill='%23E5E5E5'/%3E%3Cpath d='M8 2H6v4H2v2h6V2z' fill='%237B7D7B'/%3E%3Cpath d='M10 0H8v8H0v2h10V0z' fill='%23000'/%3E%3Cpath fill='%23BDBEBD' d='M4 4h2v2H4z'/%3E%3C/svg%3E") 4 4 repeat`,
  buttonPressed: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23BDBEBD' d='M0 0h10v10H0z'/%3E%3Cpath d='M0 0v8h2V2h6V0H0z' fill='%23000'/%3E%3Cpath d='M8 2H6v4H2v2h6V2z' fill='%23fff'/%3E%3Cpath d='M10 0H8v8H0v2h10V0z' fill='%23E5E5E5'/%3E%3Cpath d='M6 2H2v4h2V4h2V2z' fill='%237B7D7B'/%3E%3Cpath fill='%23BDBEBD' d='M4 4h2v2H4z'/%3E%3C/svg%3E") 4 4 repeat`,
  buttonRounded: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 0h2v2H4V0zM2 4V2h2v2H2zM2 4v2H0V4h2z' fill='%23fff'/%3E%3Cpath d='M6 2H4v2H2v2h2V4h2V2z' fill='%23E5E5E5'/%3E%3Cpath d='M6 4H4v2H2v2h2V6h2V4z' fill='%23BDBEBD'/%3E%3Cpath d='M8 4H6v2H4v2h2V6h2V4z' fill='%237B7D7B'/%3E%3Cpath d='M6 2h2v2H6V2zM8 6h2V4H8v2zM6 8V6h2v2H6zM6 8v2H4V8h2z' fill='%23000'/%3E%3C/svg%3E") 4 4 repeat`,
  frame: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23BDBEBD' d='M0 0h10v10H0z'/%3E%3Cpath d='M0 0v8h2V2h6V0H0z' fill='%23E5E5E5'/%3E%3Cpath d='M6 2H2v4h2V4h2V2z' fill='%23fff'/%3E%3Cpath d='M8 2H6v4H2v2h6V2z' fill='%237B7D7B'/%3E%3Cpath d='M10 0H8v8H0v2h10V0z' fill='%23000'/%3E%3Cpath fill='%23BDBEBD' d='M4 4h2v2H4z'/%3E%3C/svg%3E") 4 4 repeat`,
  frameInset: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' d='M0 0h10v10H0z'/%3E%3Cpath d='M0 0v8h2V2h6V0H0z' fill='%237B7D7B'/%3E%3Cpath d='M8 2H6v4H2v2h6V2z' fill='%23E5E5E5'/%3E%3Cpath d='M10 0H8v8H0v2h10V0z' fill='%23fff'/%3E%3Cpath d='M6 2H2v4h2V4h2V2z' fill='%23000'/%3E%3Cpath fill='%23fff' d='M4 4h2v2H4z'/%3E%3C/svg%3E") 4 4 repeat`,
  frameInsetThin: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23BDBEBD' d='M0 0h10v10H0z'/%3E%3Cpath d='M0 0v8h2V2h6V0H0z' fill='%237B7D7B'/%3E%3Cpath d='M10 0H8v8H0v2h10V0z' fill='%23fff'/%3E%3C/svg%3E") 4 4 repeat`,
  frameTop: `url("data:image/svg+xml,%3Csvg width='10' height='10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23BDBEBD' d='M0 0h10v10H0z'/%3E%3Cpath fill='%23fff' d='M0 0h10v2H0z'/%3E%3Cpath fill='%23E5E5E5' d='M0 2h10v2H0z'/%3E%3C/svg%3E") 4 4 repeat`,
};

export enum Themes {
  basic = 'basic',
  button = 'button',
  buttonActive = 'buttonActive',
  buttonPressed = 'buttonPressed',
  disabled = 'disabled',
  frame = 'frame',
  frameInset = 'frameInset',
  frameInsetThin = 'frameInsetThin',
  frameTop = 'frameTop',
}

const ThemeStyleDefault: CSSObject = {
  ':focus': {
    outline: 'none',
  },
};

export const ThemeStyles: Record<Themes, CSSObject> = {
  basic: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
  },
  button: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
    borderImage: BorderImages.button,
    borderStyle: 'solid',
    borderWidth: 4,
  },
  buttonActive: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
    borderImage: BorderImages.buttonPressed,
    borderStyle: 'solid',
    borderWidth: 4,
    backgroundImage: `
      linear-gradient(45deg, ${Colors.white} 25%, transparent 25%),
      linear-gradient(-45deg, ${Colors.white} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${Colors.white} 75%),
      linear-gradient(-45deg, transparent 75%, ${Colors.white} 75%)`,
    backgroundSize: `${Scale * 2}px ${Scale * 2}px`,
    backgroundPosition: `0 0, 0 ${Scale * 1}px, ${Scale * 1}px -${Scale *
      1}px, -${Scale * 1}px 0px`,
  },
  buttonPressed: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
    borderImage: BorderImages.buttonPressed,
    borderStyle: 'solid',
    borderWidth: 4,
  },
  disabled: {
    ...ThemeStyleDefault,
    color: Colors.darkerGray,
    textShadow: `${Scale}px ${Scale}px 0 ${Colors.lightGray}`,
    ':hover': {
      textShadow: 'none',
    },
  },
  frame: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
    borderImage: BorderImages.frame,
    borderStyle: 'solid',
    borderWidth: 4,
  },
  frameInset: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.white,
    borderImage: BorderImages.frameInset,
    borderStyle: 'solid',
    borderWidth: 4,
  },
  frameInsetThin: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
    borderImage: BorderImages.frameInsetThin,
    borderStyle: 'solid',
    borderWidth: 4,
  },
  frameTop: {
    ...ThemeStyleDefault,
    color: Colors.black,
    backgroundColor: Colors.gray,
    borderImage: BorderImages.frameTop,
    borderStyle: 'solid',
    borderWidth: 4,
  },
};
