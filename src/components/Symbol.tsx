/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Scale } from '~/constants/Styles';
import { Symbols, SymbolSvgs } from '~/constants/Symbols';
import { Image, ViewLayoutProps } from '~/ui';

const Size = 9 * Scale;

interface Props extends ViewLayoutProps {
  symbol: Symbols;
}

export function Symbol({ symbol, ...props }: Props) {
  return (
    <Image
      height={Size}
      shrink={0}
      svg={SymbolSvgs[symbol]}
      width={Size}
      {...props}
    />
  );
}
