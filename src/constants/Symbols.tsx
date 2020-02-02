import React, { ReactElement } from 'react';

export enum Symbols {
  chevronDown = 'chevronDown',
  chevronLeft = 'chevronLeft',
  chevronRight = 'chevronRight',
  chevronUp = 'chevronUp',
  help = 'help',
  mediaNext = 'mediaNext',
  mediaPause = 'mediaPause',
  mediaPlay = 'mediaPlay',
  mediaPrevious = 'mediaPrevious',
  mediaRepeat = 'mediaRepeat',
  mediaShuffle = 'mediaShuffle',
  mediaStop = 'mediaStop',
  windowClose = 'windowClose',
  windowMaximize = 'windowMaximize',
  windowMinimize = 'windowMinimize',
  windowRestore = 'windowRestore',
}

export const SymbolSvgs: Record<Symbols, ReactElement> = {
  [Symbols.chevronDown]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m4 7h-2v-2h14v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.chevronLeft]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11 4v-2h2v14h-2v-2h-2v-2h-2v-2h-2v-2h2v-2h2v-2z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.chevronRight]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m7 4v-2h-2v14h2v-2h2v-2h2v-2h2v-2h-2v-2h-2v-2z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.chevronUp]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m10 5h-2v2h-2v2h-2v2h-2v2h14v-2h-2v-2h-2v-2h-2z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.help]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="m6 0h8v2h2v4h-2v2h-2v4h-4v-4h2v-2h2v-4h-4v4h-4v-4h2z" />
        <path d="m8 14h4v4h-4z" />
      </g>
    </svg>
  ),
  [Symbols.mediaNext]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 12V6h2v6h-2zM4 12V6h2v6H4zM8 14V4h2v10H8zM2 14V4h2v10H2zM12 10V8h2v2h-2zM6 10V8h2v2H6z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.mediaPause]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M4 2h4v14H4zM10 2h4v14h-4z" />
    </svg>
  ),
  [Symbols.mediaPlay]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5 2v.5h2v2h2v2h2v2h2v1h-2v2h-2v2h-2v2h-2v2h-1V.5h1V2z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  ),
  [Symbols.mediaPrevious]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6v6H4V6h2zM12 6v6h-2V6h2zM8 4v10H6V4h2zM14 4v10h-2V4h2zM4 8v2H2V8h2zM10 8v2H8V8h2z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.mediaRepeat]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)" fill="currentColor">
        <path d="M16 6V4h-2V2h-2V0h-2v4H0v4h2V6h8v4h2V8h2V6h2z" />
        <path d="M2 12v2h2v2h2v2h2v-4h10v-4h-2v2H8V8H6v2H4v2H2z" />
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  [Symbols.mediaShuffle]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)" fill="currentColor">
        <path d="M4 4h-6v2h4v2h2v2h2v2h2v2h8v-2h-6v-2H8V8H6V6H4V4zM8 4h10v2H8V4z" />
        <path d="M16 2v6h-2V2h2zM14 0v18h-2V0h2zM16 10v6h-2v-6h2zM4 14h-6v-2h6v2z" />
        <path d="M18 14h-6v-2h6v2z" />
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  [Symbols.mediaStop]: (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M2 2h14v14H2z" />
    </svg>
  ),
  [Symbols.windowClose]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m2 2h4v2h2v2h4v-2h2v-2h4v2h-2v2h-2v2h-2v2h2v2h2v2h2v2h-4v-2h-2v-2h-4v2h-2v2h-4v-2h2v-2h2v-2h2v-2h-2v-2h-2v-2h-2z"
        fill="currentColor"
      />
    </svg>
  ),
  [Symbols.windowMaximize]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="m18 0h-18v18h18zm-2 4h-14v12h14z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  [Symbols.windowMinimize]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m2 14h12v4h-12z" fill="currentColor" />
    </svg>
  ),
  [Symbols.windowRestore]: (
    <svg
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="m16 0h-12v6h-4v12h12v-6h4zm-14 16h8v-6h-8zm12-12h-8v2h6v4h2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
};
