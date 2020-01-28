/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/core';
import { ReactNode } from 'react';

import { Frame } from './Frame';

interface Props {
  children?: ReactNode;
  css?: CSSObject;
}

export function Menu({ children, css }: Props) {
  return (
    <Frame
      css={{
        ...css,
      }}
    >
      {children}
    </Frame>
  );
}
