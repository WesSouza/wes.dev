/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ReactNode } from 'react';

import { Box, BoxProps, BoxTypes } from './Box';

interface Props extends BoxProps {
  children?: ReactNode;
}

export function Window({ children, ...props }: Props) {
  return (
    <Box type={BoxTypes.window} {...props}>
      {children}
    </Box>
  );
}
