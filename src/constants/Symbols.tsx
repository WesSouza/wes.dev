import React, { ReactElement } from 'react';

export enum Symbols {
  chevronDown,
  chevronLeft,
  chevronRight,
  chevronUp,
  help,
  windowClose,
  windowMaximize,
  windowMinimize,
  windowRestore,
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
        d="m7 4v-2h-2v14h2v-2h2v-2h2v-2h2v-2h-2v-2h-2v-2z"
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
        d="m11 4v-2h2v14h-2v-2h-2v-2h-2v-2h-2v-2h2v-2h2v-2z"
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
