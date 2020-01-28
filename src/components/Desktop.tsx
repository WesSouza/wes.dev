/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import { Colors } from '~/constants/Styles';

interface Props {
  children?: ReactNode;
}

export function Desktop({ children }: Props) {
  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        backgroundColor: Colors.teal,
      }}
    >
      {children}
    </div>
  );
}
